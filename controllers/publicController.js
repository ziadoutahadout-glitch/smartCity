const path = require('path');
const fs = require('fs');

const loadData = (filename) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../models', filename), 'utf8'));
};

/**
 * Renders a page normally (full layout) for standard requests,
 * or returns JSON { html, title, currentPage } for AJAX requests.
 */
const renderPage = (req, res, view, data) => {
    // Always attach settings to the data
    data.settings = loadData('settings.json');

    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        // AJAX: render the view without layout, return JSON
        res.render(view, { ...data, layout: false }, (err, html) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ html, title: data.title, currentPage: data.currentPage });
        });
    } else {
        // Normal: full page with layout
        res.render(view, data);
    }
};

const ProjectRepository = require('../repositories/ProjectRepository');
const EventRepository = require('../repositories/EventRepository');
const PublicationRepository = require('../repositories/PublicationRepository');
const FormationRepository = require('../repositories/FormationRepository');
const AxeRepository = require('../repositories/AxeRepository');
const SiteCounterRepository = require('../repositories/SiteCounterRepository');

exports.getHome = async (req, res) => {
    let selection;
    try { selection = loadData('selection.json'); } catch(e) { 
        selection = { slots: [] }; 
    }

    const projects = await ProjectRepository.findAll();
    const events = await EventRepository.findAll();
    const publications = await PublicationRepository.findAll();
    const formations = await FormationRepository.findAll();

    const sourceData = {
        projects: projects,
        events: events,
        publications: publications,
        formations: formations
    };

    // Default images based on type
    const defaultImages = {
        projects: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80",
        events: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
        publications: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
        formations: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
    };

    // Attach the actual item data to each slot and convert to a Slide
    const dynamicSlides = [];
    (selection.slots || []).forEach((slot, index) => {
        if (!slot.active) return;
        const dataList = sourceData[slot.type] || [];
        const itemData = dataList.find(i => i.title === slot.itemTitle);
        
        if (itemData) {
            let badge = '';
            let dateOrInfo = '';
            let link = '';
            
            if (slot.type === 'projects') {
                badge = `Projet · ${itemData.axe || ''}`;
                dateOrInfo = `Partenaire : ${itemData.partner || ''}`;
                link = itemData.url || '/projets';
            } else if (slot.type === 'events') {
                badge = `Événement · ${itemData.day || ''} ${itemData.month || ''}`;
                dateOrInfo = `${itemData.time || ''} · ${itemData.location || ''}`;
                link = itemData.url || '/evenements';
            } else if (slot.type === 'publications') {
                badge = `Publication · ${itemData.year || ''}`;
                dateOrInfo = `Auteurs : ${itemData.authors || ''}`;
                link = itemData.url_pdf || '/publications';
            } else if (slot.type === 'formations') {
                badge = `Formation · ${itemData.level || ''}`;
                dateOrInfo = `Durée : ${itemData.duration || ''}`;
                link = itemData.url || '/formations';
            }

            dynamicSlides.push({
                id: index + 1,
                title: `<em>Mise en avant</em><br>${itemData.title}`,
                description: itemData.description || '',
                badge: badge,
                bgImage: itemData.image_url || defaultImages[slot.type],
                cta: [
                    { text: "Découvrir", link: link, type: "primary" }
                ],
                card: {
                    tag: slot.type.toUpperCase(),
                    title: itemData.title,
                    description: (itemData.description || '').substring(0, 100) + '...',
                    date: dateOrInfo,
                    button: { text: "En savoir plus", link: link }
                }
            });
        }
    });

    // Fallback to default slides if no slots are active/found
    const finalSlides = dynamicSlides.length > 0 ? dynamicSlides : loadData('slides.json');

    const chiffres = loadData('chiffres.json');
    const nbrChercheurs = await SiteCounterRepository.getCounter('nbr_chercheurs');
    if (chiffres.membres) {
        chiffres.membres.value = nbrChercheurs;
    }
    if (chiffres.projets) {
        chiffres.projets.value = projects.length;
    }
    if (chiffres.evenements) {
        chiffres.evenements.value = events.length;
    }

    renderPage(req, res, 'public/home', {
        title: 'Accueil - Centre Smart City',
        currentPage: 'home',
        slides: finalSlides,
        chiffres: chiffres,
        events: events.slice(0, 3)
    });
};

exports.getQui = (req, res) => {
    renderPage(req, res, 'public/qui', {
        title: 'Qui sommes-nous - Centre Smart City',
        currentPage: 'qui'
    });
};

exports.getAxes = async (req, res) => {
    renderPage(req, res, 'public/axes', {
        title: 'Axes de recherche - Centre Smart City',
        currentPage: 'axes',
        axes: await AxeRepository.findAll()
    });
};

exports.getProjets = async (req, res) => {
    renderPage(req, res, 'public/projets', {
        title: 'Nos Projets - Centre Smart City',
        currentPage: 'projets',
        projects: await ProjectRepository.findAll()
    });
};

exports.getFormations = async (req, res) => {
    renderPage(req, res, 'public/formations', {
        title: 'Formations - Centre Smart City',
        currentPage: 'formations',
        formations: await FormationRepository.findAll()
    });
};

exports.getPublications = async (req, res) => {
    renderPage(req, res, 'public/publications', {
        title: 'Publications - Centre Smart City',
        currentPage: 'publications',
        publications: await PublicationRepository.findAll()
    });
};

exports.getEvents = async (req, res) => {
    renderPage(req, res, 'public/events', {
        title: 'Événements - Centre Smart City',
        currentPage: 'events',
        events: await EventRepository.findAll()
    });
};

exports.incrementChercheur = async (req, res) => {
    try {
        const newValue = await SiteCounterRepository.incrementCounter('nbr_chercheurs');
        res.json({ success: true, newValue });
    } catch (err) {
        console.error("Error incrementing researcher count:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
