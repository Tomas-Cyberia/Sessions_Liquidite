# Sessions · Liquidité : guide

Un seul indicateur pour le court terme, sur le forex, l'or, la crypto ou les indices. Il réunit les séances, la liquidité, les zones H4, la structure et le VWAP. Il prépare aussi en H1 les plans de la stratégie d'école de L'initiation, avec leur taille de position et leur bilan. Il ne prend qu'une place sur le plan gratuit, à côté d'EMA · RSI.

La liquidité dont il parle est celle de l'ICT et du SMC, lue sur les prix seuls. Ce n'est pas de l'order flow : voir la section 2.

## Installation

1. TradingView, onglet **Pine Editor** : nouveau script de type indicateur.
2. Remplace tout le contenu par celui de `Sessions_Liquidite.pine`, puis **Enregistrer** et **Ajouter au graphique**.
3. Dans les paramètres, groupe **6 · Taille de position**, entre ton capital, la devise de ton compte et ton risque par trade.

Le numéro de version est dans le nom de l'indicateur, en haut à gauche du graphique : « Sessions·Liquidité 1.0 ». Après une mise à jour du script, retire l'indicateur du graphique puis remets-le. Sinon, TradingView garde les anciens réglages de l'indicateur déjà posé.

## Ce qui s'affiche par défaut

| Allumé | Éteint, à activer au besoin |
|---|---|
| Séances, avec leur haut, leur bas et leur POC | Range d'ouverture |
| Haut et bas d'hier, de la semaine et du mois passés | Ouvertures du jour et de la semaine |
| Sommets et creux égaux, chiffres ronds | Structure : BOS et CHoCH |
| Zones H4 : FVG et order blocks | VWAP et ses bandes |
| Sweeps (BSL, SSL) et plans de la stratégie d'école | |
| Tableau, avec la cible de liquidité | |

Une couleur, un rôle : l'**ambre** pour la liquidité ; le **vert** et le **rouge** pour le sens, dans les zones, les sweeps et les plans ; l'**encre** pour les repères, comme l'ordre, le POC, les ouvertures, les chiffres ronds et le VWAP ; la **teinte des séances** pour le temps.

## 1 · Les séances

Asie de 1 h à 10 h, Londres de 9 h à 18 h, New York de 14 h à 23 h : les heures de Paris de la leçon 04. Elles suivent les changements d'heure de Paris ; ailleurs, elles glissent d'une heure deux fois par an, comme dans le schéma de la leçon.

Chaque séance est un fond léger, de son plus bas à son plus haut, avec son nom au-dessus. Les trois partagent une teinte : de 14 h à 18 h, Londres et New York se superposent et le fond fonce de lui-même sur la période la plus active. Elles ne s'affichent qu'en intraday, sur le nombre de jours choisi (5 par défaut).

- **Haut et bas des séances** : une fois la séance finie, son haut et son bas partent vers la droite, en trait ambre fin. Ils s'arrêtent quand le prix va les chercher, ou au début de la séance suivante du même nom. Le haut et le bas de l'Asie sont la première liquidité que Londres trouve sur son chemin.
- **POC des séances**, en trait d'encre : le prix où la séance a échangé le plus de volume. Une fois la séance finie, il part vers la droite jusqu'à ce que le prix repasse dessus : c'est un POC « nu ». Il s'arrête aussi au début de la séance suivante du même nom. Pendant la séance, le POC en cours s'affiche dans sa boîte. Il se calcule sur les bougies du graphique, en répartissant le volume de chacune sur les prix qu'elle couvre : c'est une approximation en H1, presque exacte en M5. Sur le forex, le volume est un nombre de ticks ; sans volume, chaque bougie compte pareil. C'est la seule mesure de volume de l'indicateur, et ce n'est pas de l'order flow.
- **Range d'ouverture**, éteint par défaut : une quatrième séance, la première demi-heure de Wall Street (15 h 30 à Paris), avec son haut et son bas. Pour le DAX, mets 0900-0930. Il n'apparaît qu'en M30 et en dessous : en H1, aucune bougie n'ouvre à 15 h 30.

## 2 · La liquidité

**De quelle liquidité on parle.** Celle de l'ICT et du SMC, la même que dans la leçon 14 : les stops qui dorment au-delà des sommets et des creux évidents. Au-dessus d'un sommet attendent les stops des vendeurs et les achats à la cassure : c'est la liquidité acheteuse, la *buy-side liquidity*. Sous un creux, c'est l'inverse : la liquidité vendeuse, la *sell-side liquidity*. Elle se déduit de la forme du graphique, sur les prix seuls.

**Ce n'est pas de l'order flow.** L'indicateur ne lit ni le carnet d'ordres, ni le volume acheteur et vendeur, ni le delta ou le footprint. TradingView ne donne pas les ordres posés, et le volume du forex n'y est qu'un nombre de ticks. Un niveau ambre dit où les stops ont toutes les chances d'être, pas qu'ils y sont, ni en quelle quantité.

- **Haut et bas d'hier**, en tirets ambre fins ; **de la semaine passée**, en tirets de 2 px ; **du mois passé**, en tirets de 3 px. La journée est celle de l'actif sur TradingView : elle se termine à 17 h, heure de New York, sur le forex et l'or, et à minuit UTC sur la crypto.
- **Sommets et creux égaux**, en pointillés : deux sommets (ou deux creux) au même niveau, à 0,1 ATR près. Les stops s'y accumulent (leçon 14).
- **Chiffres ronds**, en trait d'encre très pâle : les deux plus proches au-dessus et au-dessous du prix (leçon 14). Le pas est de 50 pips sur le forex. Ailleurs, il s'adapte pour donner de un à cinq chiffres ronds dans une journée moyenne. Tu peux aussi le fixer toi-même.
- **Ouvertures du jour et de la semaine**, en pointillés d'encre, éteintes par défaut : au-dessus, le prix monte sur la journée (ou la semaine) ; au-dessous, il baisse.
- **Un niveau pris** s'arrête à la bougie qui est allée le chercher, et pâlit. Les niveaux encore intacts portent leur nom à droite du graphique. Deux noms trop proches se partagent une étiquette, pour limiter les chevauchements.

**Les noms à droite** se règlent dans le groupe Apparence. En mode **Essentiels**, par défaut, il reste le plan, la cible de liquidité, et les hauts et bas d'hier, de la semaine, du mois et des séances. **Tous** ajoute les sommets égaux, les POC, les ouvertures et les chiffres ronds. **Aucun** les retire tous : les lignes restent.

**La cible de liquidité** est le « draw on liquidity » de l'ICT : le niveau encore intact le plus proche dans le sens du daily. Si le daily est à l'achat, c'est le haut le plus proche au-dessus du prix ; à la vente, le bas le plus proche au-dessous. Les candidats sont les hauts et bas d'hier, de la semaine, du mois et des séances, les sommets et creux égaux, et le dernier sommet (ou creux) intact. Son nom commence par « Cible » à droite du graphique, et le tableau donne sa distance. Elle dit où se trouve la liquidité la plus proche, pas que le prix ira la chercher.

## 3 · Les zones H4

Les deux traces d'une impulsion, celles de la leçon 15, calculées en H4 :

- **FVG**, en fond plein : le trou entre la bougie 1 et la bougie 3 de l'impulsion.
- **Order block**, en fond bordé : la dernière bougie contraire avant l'impulsion, cherchée de la bougie 1 vers les quatre qui la précèdent.

Vert : une zone d'achat. Rouge : une zone de vente. Une zone naît à la clôture de la bougie 3. Elle meurt quand une bougie H4 clôture au-delà de son autre bord, ou au bout de 30 jours : elle s'arrête alors et pâlit. Pour ne pas charger le graphique, seules les deux zones vivantes les plus récentes de chaque côté s'affichent. Toutes les autres comptent quand même pour la condition 2.

Les zones s'affichent jusqu'au H4. Les règles sont celles d'une variante du test du parcours (`Modules/_generateur/strategie.js`, variante D).

## 4 · La structure

Éteinte par défaut. Les deux mots de la leçon 05, en petit, sur un pointillé :

- **BOS** : la clôture casse le dernier sommet en hausse (ou le dernier creux en baisse) ; la tendance continue.
- **CHoCH** : la première cassure dans l'autre sens ; la tendance tourne.

Un swing de structure est la bougie la plus haute (ou la plus basse) de 5 bougies de chaque côté. Tu peux changer ce nombre. Les sweeps gardent les swings de la leçon 16, deux bougies de chaque côté.

## 5 · Les sweeps et les plans

Un sommet est une bougie plus haute que les deux de chaque côté, dans l'unité de temps du graphique. Il reste intact tant qu'aucune bougie ne le dépasse. Un **sweep**, la prise de liquidité de la leçon 14, est une mèche qui passe au-delà du dernier sommet intact (ou creux) des 72 dernières bougies, trois jours en H1, et qui clôture en deçà : les stops sont pris, et le prix revient.

- **BSL**, au-dessus de la mèche : un sommet est pris, c'est la liquidité acheteuse (*buy-side liquidity*). En rouge s'il va dans le sens de l'EMA 200 daily (condition 1) : c'est un setup de vente.
- **SSL**, sous la mèche : un creux est pris, la liquidité vendeuse (*sell-side liquidity*). En vert dans le sens : un setup d'achat.
- **En gris** : à contre-sens, ou sens inconnu. Il n'a pas de plan ; tu peux le masquer.
- **Le trait ambre** relie le niveau pris à la mèche, pour les sweeps dans le sens.

Le survol d'un BSL ou d'un SSL dit quels niveaux connus la même mèche a pris aussi (le haut d'hier, de la semaine, de l'Asie, des sommets égaux…), si elle touche une zone H4, et ce qu'est devenu son plan : exécuté, raté, annulé ou expiré.

Pour chaque sweep dans le sens, l'indicateur trace le plan de la leçon 16 dès qu'il est connu : à la clôture de la mèche, ou une bougie plus tard si la bougie d'avant la mèche peut encore devenir le dernier swing. L'alerte du plan part à ce moment-là, toujours avant l'heure de pose :

- **l'ordre stop**, trait d'encre : 1 pip au-delà du dernier sommet (à l'achat) qui précède la mèche ;
- **le stop**, trait rouge : 5 pips au-delà de la mèche ;
- **l'objectif**, pointillés verts : à 2R.

Un plan vit comme dans le test du parcours :

| État | Ce qui s'est passé |
|---|---|
| En attente | L'ordre se pose au passage suivant : 8 h, 12 h 30 ou 18 h 30, heure de Paris, en semaine |
| Raté | Le prix a touché l'entrée avant l'heure de pose : on ne court pas après |
| Annulé | Le prix a touché le niveau du stop avant l'entrée |
| Expiré | 24 heures après la pose, l'ordre n'a pas été exécuté |
| Exécuté | L'ordre est entré ; il sort au stop (−1R) ou à l'objectif (+2R). Si une bougie touche le stop et l'objectif, on retient la perte |

Sans voir dans la bougie, deux cas restent approchés, comme dans le test : la bougie qui contient l'heure de pose (de 12 h à 13 h, de 18 h à 19 h) compte comme après la pose, et une bougie qui touche l'entrée et le stop compte comme annulée.

Un plan clos pâlit, et un plan exécuté affiche son résultat, sans les frais. Le dernier plan ouvert porte ses prix à droite du graphique et remplit le tableau.

**La zone H4 (condition 2)** : chaque plan dit si sa mèche touche un FVG ou un order block H4 encore vivant, sans que sa clôture le traverse. Un support, lui, reste à juger à l'œil. Avec **Exiger une zone H4**, les sweeps hors zone n'ont plus de plan.

**En H1 seulement**, par défaut : c'est l'unité de temps de la leçon et du test. Ailleurs, les sweeps restent affichés, sans plan.

**Sans 200 jours d'historique daily**, l'EMA 200 n'existe pas : le sens est inconnu, les sweeps restent des anneaux et n'ont pas de plan.

**Hors du forex**, une marge de 5 pips ne veut rien dire : c'est presque rien sur l'or ou le Nasdaq. En mode Auto, la marge et le décalage deviennent 0,46 et 0,09 ATR 14, ce que valent 5 pips et 1 pip sur l'EUR/USD en H1, dont l'ATR médian est de 10,8 pips. Sur le forex, ils restent en pips, comme dans la leçon.

## 6 · La taille de position

Taille = capital × risque ÷ (distance du stop × valeur d'un point), convertie dans la devise de ton compte au taux du jour. Elle s'arrondit au centième de lot inférieur, pour ne jamais dépasser ton risque.

- **Forex** : en lots de 100 000 unités.
- **Or** : en lots de 100 onces ; **argent** : 5 000 onces.
- **Crypto** : en unités de la monnaie, par exemple en BTC.
- **Futures** : en contrats.
- **Indices en CFD** : en unités, une unité valant le plus souvent un point d'indice dans sa devise. La taille du contrat change d'un courtier à l'autre : vérifie la tienne et, au besoin, choisis une taille de lot manuelle.

## 7 · Le VWAP

Éteint par défaut. Le prix moyen pondéré par les volumes depuis le début du jour (ou de la semaine), en trait d'encre, avec ses bandes à 1 et 2 écarts-types en pointillés. Il est très suivi sur les indices et la crypto. Sur un actif sans volume, chaque bougie compte pareil.

## 8 · Le tableau

Il se place en bas à droite par défaut, parce qu'EMA · RSI occupe le haut. Ses trois parties s'allument une par une, dans le groupe 8. Deux réglages l'allègent : **Texte**, en petit, et **Compact**, qui ne garde que le sens, la cible de liquidité, le feu rouge s'il s'allume, l'ordre et sa taille.

| Ligne | Ce qu'elle dit |
|---|---|
| Sens daily | Achats si la clôture d'hier est au-dessus de l'EMA 200, ventes si elle est au-dessous ; « n/d » sans 200 jours d'historique, ou au-dessus du daily |
| Cible de liquidité | Le niveau intact le plus proche dans le sens daily, son prix et sa distance, en pips sur le forex, en % ailleurs |
| Tendance | Le prix au-dessus (▲) ou au-dessous (▼) de l'EMA 200 en weekly, en H4 et en H1, à la dernière clôture |
| Séance | La séance en cours, ou « Hors séance » |
| Amplitude du jour | Le chemin du plus bas au plus haut d'aujourd'hui, en part de la moyenne des 14 derniers jours |
| Prochain passage | L'heure du prochain passage de la routine |
| Pertes du jour, Feu rouge | Les plans perdants d'aujourd'hui, journée de Paris. « 1 sur 2 » après une perte ; à deux, « Feu rouge » en rouge : on s'arrête pour la journée (leçon 18). Il compte les plans de l'indicateur : si tu n'en prends qu'une partie, compte les tiens |
| Ordre | Le dernier plan ouvert, et son heure de pose ; « En cours » une fois exécuté |
| Stop · objectif | Ses deux prix |
| Risque | La distance du stop, en pips sur le forex, en % ailleurs, et ce que coûtent les frais en R (leçon 22) |
| Taille | La taille de position pour ton risque par trade (1 % dans la leçon 08) |
| Zone H4 | Si la mèche du sweep touche un FVG ou un order block H4 |
| Bilan net | Les plans exécutés sur ce graphique : leur nombre, la part de gagnants et le résultat moyen par trade, frais compris |
| Sur zone H4 | Le même résultat, pour les plans dont la mèche touchait une zone |
| Pire série | La plus longue suite de pertes du graphique (leçon 11) |

Les frais par défaut sont proches de ceux du test : 1 pip sur le forex, 0,1 % du prix sur la crypto, 0,01 % ailleurs. Tu peux entrer les tiens.

## Ce que disent les tests

La stratégie a été rejouée sur l'or, la crypto et les indices avec les règles exactes du parcours (`test/test_actifs.js`, données horaires de Yahoo). Sur l'ensemble, elle fait +0,10R par trade sur 428 trades, quand le hasard seul fait varier ce chiffre de ±0,14R. L'or seul fait +0,17R par trade, avec une marge de ±0,28R. 2026 est négatif sur 4 marchés sur 6. Sur le forex, la même stratégie reste à l'équilibre : 0,00R par trade.

Avec la condition 2 en plus, telle que l'indicateur la vérifie, 71 % des sweeps du forex touchent une zone H4. Ces trades font +0,04R par trade sur le forex (471 trades, marge ±0,13R), et +0,09R sur l'or, la crypto et les indices (310 trades, marge ±0,16R). La zone H4 ne change rien de mesurable : les deux résultats restent dans la marge du hasard, comme sans elle.

Rien ne se distingue donc nettement de l'équilibre : l'indicateur montre des setups, pas un avantage. Le tableau complet, année par année, est dans `test/Résultats.md`. Le bilan du tableau rejoue les mêmes règles sur ton graphique : c'est le moyen de voir ce que la stratégie donne sur ton actif.

Pour rejouer le test : `node test_actifs.js` dans le dossier `test`. Il réécrit `Résultats.md` et `resultats.json`. Les données horaires de Yahoo, dans `test/data`, ne sont pas publiées sur GitHub : le script et ses résultats le sont.

## 9 · Les alertes

Clic droit sur le graphique, **Ajouter une alerte**, condition **Sessions · Liquidité**, fréquence **Une fois par clôture de barre**.

**Toute fonction alert()** envoie un message complet, selon ce que tu coches dans le groupe 9 :

| Case | Le message |
|---|---|
| Plan prêt, coché | « EURUSD : achat stop 1,1498, stop 1,1468, objectif 1,1558, ordre à poser à 18 h 30. Sweep du creux 1,1476 (pris aussi : Bas Asie), dans le sens, sur un FVG H4 » |
| Ordre exécuté, coché | L'entrée réelle, le stop et l'objectif |
| Plan clos, coché | Objectif atteint ou stop touché, avec le résultat en R ; à la deuxième perte du jour, le feu rouge |
| Niveau pris | Un haut ou un bas d'hier, de la semaine, du mois ou d'une séance |
| Sweep dans le sens | Chaque BSL ou SSL dans le sens de l'EMA 200 daily, avec les niveaux que la mèche a pris |
| Zone H4 touchée | La première fois que le prix touche une zone, dans le sens de l'EMA 200 daily |

Les autres conditions se choisissent une par une dans la liste : **Nouveau plan de trade**, **Sweep d'achat dans le sens**, **Sweep de vente dans le sens**, **Zone H4 touchée dans le sens**, **Haut ou bas d'hier pris**, **Haut ou bas de la semaine passée pris**, **Haut ou bas d'une séance pris**, **Cassure de structure**.

## Bon à savoir

- **Rien ne repeint** : tout se calcule à la clôture des bougies, et ce qui vient du daily, du weekly ou du H4 est pris à la clôture de leur bougie précédente.
- **Au Replay** (leçon 19), l'indicateur avance bougie par bougie comme en direct : les plans, les zones et le bilan se construisent au fil de la lecture.
- **Le thème** reprend les quatre ambiances d'EMA · RSI : choisis le même dans les deux indicateurs.
- **Les dessins** : TradingView en autorise 500 de chaque sorte. L'indicateur garde les plus récents de chaque famille, pour que les niveaux en cours ne s'effacent jamais. Hors H1, au-delà de 25 plans ouverts, le plus ancien s'efface sans entrer au bilan ; en H1, sur les données du test, jamais plus de 9 ne sont ouverts à la fois.
- **Des bougies classiques** : en Heikin Ashi, TradingView recalcule les prix, et les plans comme le bilan ne veulent plus rien dire.
