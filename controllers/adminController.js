const path = require('path');
const fs = require('fs');

const loadData = (filename) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../models', filename), 'utf8'));
};

const ProjectRepository = require('../repositories/ProjectRepository');
const EventRepository = require('../repositories/EventRepository');
const PublicationRepository = require('../repositories/PublicationRepository');
const FormationRepository = require('../repositories/FormationRepository');

exports.getDashboard = async (req, res) => {
    res.render('admin/dashboard', {
        layout: 'layouts/admin',
        title: 'Dashboard Admin',
        currentPage: 'dashboard',
        projects: await ProjectRepository.findAll(),
        events: await EventRepository.findAll(),
        publications: await PublicationRepository.findAll(),
        formations: await FormationRepository.findAll()
    });
};

exports.getEvents = async (req, res) => {
    res.render('admin/events', {
        layout: 'layouts/admin',
        title: 'Gérer les événements',
        currentPage: 'events',
        events: await EventRepository.findAll()
    });
};

exports.getProjects = async (req, res) => {
    res.render('admin/projects', {
        layout: 'layouts/admin',
        title: 'Gérer les projets',
        currentPage: 'projects',
        projects: await ProjectRepository.findAll(),
        axes: await require('../repositories/AxeRepository').findAll()
    });
};

exports.getPublications = async (req, res) => {
    res.render('admin/publications', {
        layout: 'layouts/admin',
        title: 'Gérer les publications',
        currentPage: 'publications',
        publications: await PublicationRepository.findAll()
    });
};

exports.getFormations = async (req, res) => {
    res.render('admin/formations', {
        layout: 'layouts/admin',
        title: 'Gérer les formations',
        currentPage: 'formations',
        formations: await FormationRepository.findAll()
    });
};

exports.getChiffres = (req, res) => {
    res.render('admin/chiffres', {
        layout: 'layouts/admin',
        title: 'Gérer les chiffres clés',
        currentPage: 'chiffres',
        chiffres: loadData('chiffres.json')
    });
};

exports.getSettings = (req, res) => {
    res.render('admin/settings', {
        layout: 'layouts/admin',
        title: 'Paramètres du Site',
        currentPage: 'settings',
        settings: loadData('settings.json')
    });
};

exports.postSettings = (req, res) => {
    try {
        const currentSettings = loadData('settings.json');
        
        // General
        if (req.body.siteName !== undefined) currentSettings.general.siteName = req.body.siteName;
        if (req.body.universityName !== undefined) currentSettings.general.universityName = req.body.universityName;
        if (req.body.contactEmail !== undefined) currentSettings.general.contactEmail = req.body.contactEmail;
        if (req.body.contactPhone !== undefined) currentSettings.general.contactPhone = req.body.contactPhone;
        if (req.body.address !== undefined) currentSettings.general.address = req.body.address;
        if (req.body.websiteUrl !== undefined) currentSettings.general.websiteUrl = req.body.websiteUrl;
        
        // Home Hook
        if (req.body.hookBadge !== undefined) currentSettings.homeHook.badgeText = req.body.hookBadge;
        if (req.body.hookTitle !== undefined) currentSettings.homeHook.title = req.body.hookTitle;
        if (req.body.hookSubtitle !== undefined) currentSettings.homeHook.subtitle = req.body.hookSubtitle;
        
        // Director
        if (req.body.dirName !== undefined) currentSettings.director.name = req.body.dirName;
        if (req.body.dirTitle !== undefined) currentSettings.director.title = req.body.dirTitle;
        if (req.body.dirSubtitle !== undefined) currentSettings.director.subtitle = req.body.dirSubtitle;
        if (req.body.dirQuote !== undefined) currentSettings.director.quote = req.body.dirQuote;
        if (req.body.dirPhoto !== undefined) currentSettings.director.photoUrl = req.body.dirPhoto;

        // Qui sommes-nous
        if (req.body.quiTitle !== undefined) currentSettings.quiSommesNous.title = req.body.quiTitle;
        if (req.body.quiDesc !== undefined) currentSettings.quiSommesNous.description = req.body.quiDesc;
        if (req.body.quiVision !== undefined) currentSettings.quiSommesNous.vision = req.body.quiVision;
        if (req.body.quiMission !== undefined) currentSettings.quiSommesNous.mission = req.body.quiMission;

        fs.writeFileSync(path.join(__dirname, '../models', 'settings.json'), JSON.stringify(currentSettings, null, 2), 'utf8');
        res.redirect('/admin/settings');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la sauvegarde.");
    }
};

exports.postChiffres = (req, res) => {
    try {
        const chiffres = loadData('chiffres.json');
        
        if (req.body.membresValue !== undefined) chiffres.membres.value = parseInt(req.body.membresValue, 10);
        if (req.body.membresActive !== undefined) chiffres.membres.active = req.body.membresActive === 'true';

        if (req.body.projetsValue !== undefined) chiffres.projets.value = parseInt(req.body.projetsValue, 10);
        if (req.body.projetsActive !== undefined) chiffres.projets.active = req.body.projetsActive === 'true';

        if (req.body.evenementsValue !== undefined) chiffres.evenements.value = parseInt(req.body.evenementsValue, 10);
        if (req.body.evenementsActive !== undefined) chiffres.evenements.active = req.body.evenementsActive === 'true';

        if (req.body.partenairesValue !== undefined) chiffres.partenaires.value = parseInt(req.body.partenairesValue, 10);
        if (req.body.partenairesActive !== undefined) chiffres.partenaires.active = req.body.partenairesActive === 'true';

        fs.writeFileSync(path.join(__dirname, '../models', 'chiffres.json'), JSON.stringify(chiffres, null, 2), 'utf8');
        res.redirect('/admin/chiffres');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la sauvegarde.");
    }
};

exports.getSelection = (req, res) => {
    let selection;
    try {
        selection = loadData('selection.json');
    } catch (e) {
        selection = {
            slots: [
                { active: true, type: "projects", itemTitle: "" },
                { active: true, type: "events", itemTitle: "" },
                { active: true, type: "publications", itemTitle: "" },
                { active: true, type: "formations", itemTitle: "" }
            ]
        };
    }

    res.render('admin/selection', {
        layout: 'layouts/admin',
        title: 'Mise en avant (Accueil)',
        currentPage: 'selection',
        selection: selection,
        projects: loadData('projects.json'),
        events: loadData('events.json'),
        publications: loadData('publications.json'),
        formations: loadData('formations.json')
    });
};

exports.postSelection = (req, res) => {
    try {
        const slots = [];
        for (let i = 0; i < 4; i++) {
            slots.push({
                active: req.body[`slot${i}_active`] === 'true',
                type: req.body[`slot${i}_type`],
                itemTitle: req.body[`slot${i}_item`] || ''
            });
        }
        
        const selection = { slots };
        fs.writeFileSync(path.join(__dirname, '../models', 'selection.json'), JSON.stringify(selection, null, 2), 'utf8');
        res.redirect('/admin/selection');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la sauvegarde.");
    }
};

const { uploadToDrive } = require('../services/googleDriveService');

// Helper for file uploads to Google Drive
const processUploads = async (req, data) => {
    if (req.files) {
        if (req.files['image_file'] && req.files['image_file'][0]) {
            data.image_url = await uploadToDrive(req.files['image_file'][0]);
        }
        if (req.files['pdf_file'] && req.files['pdf_file'][0]) {
            data.pdf_url = await uploadToDrive(req.files['pdf_file'][0]);
        }
    }
    return data;
};

// --- CRUD PROJECTS ---
exports.postAddProject = async (req, res) => {
    try {
        const data = await processUploads(req, { ...req.body });
        await ProjectRepository.create(data);
        res.redirect('/admin/projects');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
exports.postDeleteProject = async (req, res) => {
    try {
        await ProjectRepository.delete(req.params.id);
        res.redirect('/admin/projects');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// --- CRUD EVENTS ---
exports.postAddEvent = async (req, res) => {
    try {
        const data = await processUploads(req, { ...req.body });
        await EventRepository.create(data);
        res.redirect('/admin/events');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
exports.postDeleteEvent = async (req, res) => {
    try {
        await EventRepository.delete(req.params.id);
        res.redirect('/admin/events');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// --- CRUD PUBLICATIONS ---
exports.postAddPublication = async (req, res) => {
    try {
        const data = await processUploads(req, { ...req.body });
        await PublicationRepository.create(data);
        res.redirect('/admin/publications');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
exports.postDeletePublication = async (req, res) => {
    try {
        await PublicationRepository.delete(req.params.id);
        res.redirect('/admin/publications');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// --- CRUD FORMATIONS ---
exports.postAddFormation = async (req, res) => {
    try {
        const data = await processUploads(req, { ...req.body });
        await FormationRepository.create(data);
        res.redirect('/admin/formations');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
exports.postDeleteFormation = async (req, res) => {
    try {
        await FormationRepository.delete(req.params.id);
        res.redirect('/admin/formations');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
