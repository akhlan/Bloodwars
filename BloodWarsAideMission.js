// ==UserScript==
// @name         BloodWars - Réponses aux missions
// @author       Pok Marvel
// @namespace    http://tampermonkey.net/
// @version      13.11.2024-1.1
// @description  Ajoute des réponses aux missions spécifiques sur la page BloodWars
// @copyright    2024, Pok Marvel
// @license      GPL version 3 ou suivantes; http://www.gnu.org/copyleft/gpl.html
// @homepageURL  https://github.com/Akhlan/BloodWarsAideMission
// @supportURL   https://github.com/Akhlan/BloodWarsAideMission/issues
// @match        https://r1.bloodwars.net/*
// @match        https://r2.bloodwars.net/*
// @match        https://r3.bloodwars.net/*
// @match        https://r4.bloodwars.net/*
// @match        https://r1.fr.bloodwars.net/*
// @match        https://r1.fr.bloodwars.net/*
// @match        https://r2.fr.bloodwars.net/*
// @match        https://r3.fr.bloodwars.net/*
// @match        https://r4.fr.bloodwars.net/*
// @match        https://r7.fr.bloodwars.net/*
// @match        https://r8.fr.bloodwars.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Liste des questions et réponses
    const questionReponses = [
        {
            question: "Atteints le 80-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 80 ou supérieur."
        },
        {
            question: "Prouve ton talent pour les affaires. Fais bâtir Le Cimetière et La Banque de Sang.",
            reponse: "Pour la valider : Construire le Cimetière et la Banque de Sang. Si l`un des deux est déjà construit, il suffit de construire l`autre. Si les deux sont déjà construits, il suffit de monter le niveau de l`un d`eux."
        },
        {
            question: "Conquiers les cours et les esprits de la foule. Acquis 50 points de charisme",
            reponse: "Pour la valider : Monter le Charisme à 50 ou plus."
        },
        {
            question: "L’Ordre de Saint Benoît a envoyé un assassin à ta trousse. Trouve le dans les environs de La Cité.",
            reponse: "Pour la valider : Vaincre un monstre en un contre un pendant une quête dans Les environs de la Cité."
        },
        {
            question: "Deviens le maître des plus obscures coins de La Cité. Acquis 55 points de réputation.",
            reponse: "Pour la valider : Monter la Réputation à 55 ou plus."
        },
        {
            question: "Le Seigneur de l’Obscurité veut que dans sa Cathédrale on ne manque pas de sang. Etant un membre de Cercle Intérieur tu es obligé de faire un sacrifice. Accumule 800 000 litres de sang et sacrifie 10% de cette réserve au Seigneur.",
            reponse: "Pour la valider : Cliquer sur «Cliquez ici pour donnez les ressources» une fois les 800 000 litres de sang sur soi."
        },
        {
            question: "Une véritable expérience ne peut s’acquérir qu’en parcourant les voies dangereuse. Fait au moins 15 pèlerinages (réussis) vers l’inconnu.",
            reponse: "Pour la valider : Réussir 15 pèlerinages en Z2. Le jeu conserve en mémoire le nombre de pèlerinage réussis même si on change de zone entre deux sessions d`essais."
        },
        {
            question: "Tu as été informé d’une anomalie étrange située quelque part dans le désert. Trouve et explique ce phénomène mystérieux.",
            reponse: "Pour la valider : Réussir un pèlerinage avec comme paramètre une moyenne entre votre intelligence et votre savoir."
        },
        {
            question: "Tes agents t’ont signalé que près d’un pillard tué aux alentours d’une ville ils ont trouvés une lettre. Cette lettre indique que ton arrière-petite-fille, Anhala est emprisonnée sur les Champs de Couvoirs. Organise une expédition de secours.",
            reponse: "Pour la valider : Lancer n`importe quelle expédition (map1 sûre, map2 sujette à débats). Il y aura 1 gargouille de plus que de participants avec au minimum 3 gargouilles. Le % de chance de tomber sur des gargouilles en lançant l'expédition dépend du site, les 100% étant atteints sur le dernier site de la map1 (Le Cercle de Cronos)."
        },
        {
            question: "La ville entière observe les membres du Conseil. Montre ta puissance et assure le sang pour tes protégés. Développe l’Hôpital jusqu’au niveau 7 et la Boucherie jusqu’au niveau 22.",
            reponse: "Pour la valider : Construire l`Hôpital au niveau 7 et la Boucherie au niveau 22. Si l`un des deux est déjà construit à un niveau suffisant, il suffit de construire l`autre au niveau requis. Si les deux sont déjà construits aux niveaux requis, il suffit de monter le niveau de l`un d`eux."
        },
        {
            question: "La réputation ce n’est pas tout, les vampires ne suivent que les plus puissants. Atteins le 84-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 84 ou supérieur."
        },
        {
            question: "Ton quartier a été assailli par les paladins de l`Ordre de Saint Benoît. Prépare-toi à l`ultime bataille entre les deux forces opposées....",
            reponse: "Pour la valider : Lancer un siège sur son propre quartier. Petite remarque: tous les ennemis utilisent l`arcane absorption de force."
        },
        {
            question: "Le Grand Maître de l`Ordre a échappé à la mort pendant la dernière bataille. Tu le trouvera quelque part dans l`impitoyable désert. Vas-y et offre-lui l`opportunité de rencontrer son dieu...",
            reponse: "Pour la valider : Vaincre 2 monstres pendant une quête dans un pèlerinage vers l'inconnu."
        },
        {
            question: "Deviens Le Maître / La Maîtresse de la Cité. Là et maintenant.",
            reponse: "Pour la valider : Passer en zone 1."
        }
    ];

    // Fonction pour insérer les réponses sous les questions correspondantes
    questionReponses.forEach(item => {
        const allElements = document.querySelectorAll(".tasks_tasksDesc");

        allElements.forEach(element => {
            // Si l'élément contient la question, on insère la réponse
            if (element.textContent.includes(item.question)) {
                // Créer un élément pour la réponse
                const reponseElement = document.createElement('div');
                reponseElement.style.marginTop = '10px'; // Un peu d'espace avant la réponse

                // Modifier "Pour la valider : " en rouge
                const reponseText = item.reponse.replace("Pour la valider : ", "<span style='color: red;'>Pour la valider : </span>");

                // Insérer la réponse avec le texte en rouge pour la partie "Pour la valider :"
                reponseElement.innerHTML = reponseText;

                // Ajouter la réponse juste après la question
                element.appendChild(reponseElement);
            }
        });
    });
})();

