const { google } = require('googleapis');
const stream = require('stream');
require('dotenv').config();

// Configuration de l'authentification Google
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Upload un fichier (buffer) vers Google Drive.
 * @param {Object} file - L'objet fichier venant de multer
 * @returns {Promise<string>} - L'URL publique de visualisation (webViewLink)
 */
async function uploadToDrive(file) {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
        throw new Error("Configuration Google Drive manquante dans le fichier .env");
    }

    try {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        const fileMetadata = {
            name: `${Date.now()}_${file.originalname}`,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
        };

        const media = {
            mimeType: file.mimetype,
            body: bufferStream
        };

        // Création du fichier sur Drive
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink'
        });

        const fileId = response.data.id;

        // Rendre le fichier public
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        // Récupérer le lien
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        });

        return result.data.webViewLink;

    } catch (error) {
        console.error("Erreur lors de l'upload sur Google Drive:", error);
        throw error;
    }
}

module.exports = {
    uploadToDrive
};
