const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateAxes() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '1234',
            database: process.env.DB_NAME || 'smartcity',
            port: process.env.DB_PORT || 3306
        });

        const axesData = [
            {
                slug: "gouvernance-intelligente",
                description: `<ul>
                    <li>Participation citoyenne et co-construction des politiques publiques</li>
                    <li>Transparence, open data et prise de décision basée sur les données</li>
                    <li>Digitalisation des services administratifs (e-gouvernement)</li>
                    <li>Coordination entre collectivités, universités, entreprises et société civile</li>
                </ul>`
            },
            {
                slug: "mobilite-intelligente",
                description: `<ul>
                    <li>Transports publics intelligents et multimodaux</li>
                    <li>Logistique et transport</li>
                    <li>Gestion du trafic en temps réel</li>
                    <li>Mobilité durable (véhicules électriques, borne de recharge, vélo, marche)</li>
                    <li>Systèmes de transport connectés et sûrs (ITS, C-ITS)</li>
                    <li>Sécurité routière</li>
                </ul>`
            },
            {
                slug: "energie-environnement",
                description: `<ul>
                    <li>Énergies renouvelables et efficacité énergétique</li>
                    <li>Gestion intelligente de l’eau, des déchets et de l’assainissement</li>
                    <li>Réduction des émissions de CO₂</li>
                    <li>Protection de la biodiversité et adaptation au changement climatique</li>
                    <li>Smart Grid et gestion intelligente de la consommation énergétique</li>
                    <li>Prévention des risques environnementaux (incendie, inondation, sécheresse...)</li>
                </ul>`
            },
            {
                slug: "economie-gestion",
                description: `<ul>
                    <li>Innovation, entrepreneuriat et économie numérique</li>
                    <li>Soutien aux start-ups, incubateurs et pôles d’innovation</li>
                    <li>Développement des plateformes d’Offshore : délocalisation des activités économiques</li>
                    <li>Économie circulaire et valorisation des ressources locales</li>
                    <li>Tourisme et Attractivité territoriale</li>
                    <li>Emploi qualifié, insertion professionnel et formation continue</li>
                </ul>`
            },
            {
                slug: "habitat-urbanisme",
                description: `<ul>
                    <li>Bâtiments intelligents durables : domotique</li>
                    <li>Urbanisme résilient et inclusif</li>
                    <li>Qualité de vie, sécurité et accessibilité</li>
                    <li>Espace vert connecté : SMART Garden, SMART Farm</li>
                    <li>SIG</li>
                </ul>`
            },
            {
                slug: "citoyen-inclusion",
                description: `<ul>
                    <li>Éducation personnalisée, e-learning (MOOC, SPOC, RV, RA)</li>
                    <li>Inclusion sociale et égalité d’accès aux services</li>
                    <li>Innovation sociale et participation communautaire</li>
                    <li>Culture, créativité et bien-être</li>
                    <li>Sociologie et science de l’éducation</li>
                </ul>`
            },
            {
                slug: "sante-intelligente",
                description: `<ul>
                    <li>Télémédecine et e-santé</li>
                    <li>Systèmes de surveillance sanitaire (one health...)</li>
                    <li>Prévention, accessibilité et qualité des soins</li>
                    <li>Solutions logistiques sanitaires intelligentes</li>
                    <li>Gestion intelligente des urgences</li>
                </ul>`
            },
            {
                slug: "surete-resilience",
                description: `<ul>
                    <li>Vidéoprotection intelligente et gestion des risques</li>
                    <li>Crime et violence numérique</li>
                    <li>Protection de la vie privée</li>
                </ul>`
            },
            {
                slug: "industrie-innovation",
                description: `<ul>
                    <li>Digitalisation des procédés et systèmes cyber-physiques</li>
                    <li>Intelligence artificielle et optimisation industrielle</li>
                    <li>Transition énergétique et décarbonation des systèmes industriels</li>
                    <li>Matériaux avancés et intelligents</li>
                    <li>Applications biomédicales et bio-ingénierie intelligente</li>
                    <li>Sustainability et responsabilité industrielle</li>
                </ul>`
            },
            {
                slug: "technologies-donnees",
                description: `<ul>
                    <li>Internet des objets (IoT)</li>
                    <li>Blockchain et sécurité</li>
                    <li>Cloud Computing, Data Center</li>
                    <li>Intelligence artificielle et Big Data</li>
                    <li>La Gouvernance des données</li>
                    <li>Gouvernance IT, Management IT</li>
                    <li>Plateformes numériques</li>
                    <li>Connectivité et réseaux (5G, 6G, LORA, Wifi...)</li>
                </ul>`
            }
        ];

        console.log("Mise à jour des descriptions des axes avec les bullet points...");
        for (const axe of axesData) {
            await connection.execute(
                'UPDATE axes SET description = ? WHERE slug = ?',
                [axe.description, axe.slug]
            );
        }

        console.log("Mise à jour terminée avec succès!");
        await connection.end();
    } catch (err) {
        console.error("Erreur:", err);
        process.exit(1);
    }
}

updateAxes();
