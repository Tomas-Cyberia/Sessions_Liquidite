<img src="https://raw.githubusercontent.com/Tomas-Cyberia/Sessions_Liquidite/main/banniere.jpg" alt="Sessions · Liquidité : le court terme, en intraday" width="100%">

# Sessions · Liquidité

Version 1.0 · [journal des versions](#versions)

Le court terme de L'initiation dans **un seul indicateur** TradingView. Il réunit les séances et leur POC, la liquidité, les zones H4, la structure et le VWAP. Il trace aussi les plans de la stratégie d'école, avec leur taille de position et leur bilan.

**La liquidité, au sens ICT et SMC** : les stops qui dorment au-delà des sommets et des creux évidents, déduits des prix seuls. Ce n'est pas de l'order flow : ni carnet d'ordres, ni volume acheteur ou vendeur, ni delta.

Il sert en intraday, sur le forex, l'or, la crypto ou les indices : voir où les stops ont toutes les chances d'attendre et sur quelle zone le prix arrive, puis préparer en H1 les ordres de la stratégie d'école.

![Aperçu](https://cyberiaclub.fr/images/indicateurs/sessions-liquidite.webp)

## Installation

1. Ouvrir l'**éditeur Pine Script** de [TradingView](https://tradingview.com/).
2. Coller le contenu de [`Sessions_Liquidite.pine`](Sessions_Liquidite.pine).
3. **Enregistrer**, puis **Ajouter au graphique**.

Il ne prend qu'une place : sur le plan gratuit, il tient à côté d'EMA · RSI.

## Comment le lire

| Repère | Ce que ça veut dire |
|---|---|
| Fond léger, « Asie », « Londres », « New York » | Les séances, en heure de Paris, de leur plus bas à leur plus haut. Le fond fonce de 14 h à 18 h, quand Londres et New York se chevauchent |
| Trait d'encre dans une séance, « POC Londres » | Le prix où la séance a échangé le plus de volume ; il avance tant que le prix n'est pas repassé dessus |
| Trait ambre fin, « Haut Asie » | Le haut ou le bas d'une séance finie, jusqu'à ce que le prix aille le chercher |
| Tirets ambre, « Haut J-1 », « Bas S-1 » | Le haut et le bas d'hier (1 px), de la semaine passée (2 px) et du mois passé (3 px) |
| « Cible · Haut Asie » | La cible de liquidité : le niveau intact le plus proche dans le sens du daily |
| Pointillés ambre, « Sommets égaux » | Deux sommets au même niveau : des stops ont toutes les chances d'y dormir |
| Trait d'encre très pâle, avec son prix | Un chiffre rond proche du prix |
| Une ligne qui s'arrête et pâlit | Le prix est allé chercher le niveau |
| Fond vert ou rouge | Une zone H4 d'achat ou de vente : plein pour un FVG, bordé pour un order block |
| **BSL** en rouge au-dessus d'une mèche | Sweep d'un sommet, la liquidité acheteuse prise : mèche au-dessus, clôture en dessous, dans le sens de l'EMA 200 daily |
| **SSL** en vert sous une mèche | Sweep d'un creux, la liquidité vendeuse prise, dans le sens |
| BSL ou SSL en gris | Le même sweep, à contre-sens : pas de plan |
| Trait d'encre, trait rouge, pointillés verts | Le plan : l'ordre stop, le stop, l'objectif à 2R |
| « +2R », « −1R » | Le résultat d'un plan exécuté, sans les frais |

**En option** : les cassures de structure (BOS, CHoCH), le VWAP et ses bandes, le range d'ouverture de Wall Street ou du DAX, les ouvertures du jour et de la semaine.

**Le tableau**, en bas à droite, en trois parties :
- **Contexte** : le sens du daily, la cible de liquidité, la tendance en weekly, H4 et H1, la séance, l'amplitude du jour et le prochain passage de la routine.
- **Plan** : le feu rouge après deux pertes dans la journée (leçon 18), l'ordre, le stop, l'objectif, le risque et ses frais, la taille de position et la zone H4.
- **Bilan** : les plans passés de ce graphique, frais compris, et la pire série de pertes.

## La stratégie d'école

Les six conditions de la leçon 16, en H1, à l'achat. L'indicateur vérifie la 1, la 2 pour les order blocks et les FVG, et la 3. Il trace ensuite la 4, la 5 et la 6. Un support reste à juger à l'œil.

1. Daily au-dessus de l'EMA 200.
2. Le prix sur une zone H4 : support, OB, FVG.
3. Une mèche sous le dernier creux H1 intact, clôture au-dessus.
4. Achat stop 1 pip au-dessus du dernier sommet qui précède la mèche.
5. Stop 5 pips sous la mèche.
6. Objectif à 2R.

À la vente, tout s'inverse. L'ordre se pose au passage suivant de la routine (8 h, 12 h 30 ou 18 h 30, heure de Paris, en semaine). Il s'annule après 24 heures, ou si le prix touche le niveau du stop avant. Hors du forex, les 5 pips et le pip deviennent 0,46 et 0,09 ATR : la même règle, à la mesure de ce que bouge l'actif.

## Ce que disent les tests

Rejouée sur deux à trois ans de données horaires, la stratégie reste à l'équilibre sur le forex : 0,00R par trade. Sur l'or, la crypto et les indices réunis, elle fait +0,10R par trade sur 428 trades, dans la marge du hasard (±0,14R) : pas d'avantage démontré. Avec la zone H4 en plus, elle fait +0,04R sur le forex et +0,09R ailleurs. La zone H4 ne change rien de mesurable : les deux résultats restent dans la marge du hasard, comme sans elle. Le détail est dans [`test/Résultats.md`](test/Résultats.md).

L'indicateur montre des setups, pas un avantage. Il sert à apprendre l'exécution, au Replay comme en démo, et son bilan rejoue les mêmes règles sur ton propre graphique.

## Les alertes

Clic droit sur le graphique, **Ajouter une alerte**, condition **Sessions · Liquidité** :
- **Toute fonction alert()** : le plan complet dès qu'il est prêt, puis son exécution et sa sortie. Les niveaux pris et les zones touchées sont à cocher dans le groupe 9 ;
- **Sweep d'achat dans le sens** et **Sweep de vente dans le sens** ;
- **Nouveau plan de trade**, **Zone H4 touchée dans le sens**, **Cassure de structure** ;
- **Haut ou bas d'hier pris**, **de la semaine passée**, **d'une séance**.

## Réglages à faire varier

Les réglages par défaut suivent la leçon 16. À changer seulement si besoin :

| Réglage | Groupe | Quand |
|---|---|---|
| Thème | Apparence | Le même que dans EMA · RSI |
| Noms à droite | Apparence | Essentiels par défaut ; Tous pour chaque niveau, Aucun pour un graphique nu |
| Heures des séances, range d'ouverture | 1 · Séances | Toujours en heure de Paris |
| Ouvertures, pas des chiffres ronds | 2 · Liquidité | Pour ajouter des niveaux |
| Zones affichées de chaque côté | 3 · Zones H4 | Deux par défaut ; toutes comptent pour la condition 2 |
| Cassures de structure | 4 · Structure | Pour voir les BOS et les CHoCH de la leçon 05 |
| Exiger une zone H4 | 5 · Stratégie d'école | Pour ne garder que les plans sur un OB ou un FVG |
| Plans seulement en H1 | 5 · Stratégie d'école | À couper pour voir des plans dans une autre unité de temps, jamais testée |
| Frais par trade | 5 · Stratégie d'école | Pour que le bilan compte tes frais |
| Capital, devise et risque | 6 · Taille de position | Pour que la taille affichée soit la tienne |
| Taille d'un lot | 6 · Taille de position | Si ton courtier n'utilise pas les tailles usuelles, surtout pour les indices en CFD |
| VWAP | 7 · VWAP | Sur les indices et la crypto |
| Contexte, plan, bilan, compact, texte | 8 · Tableau | Pour alléger le tableau, sur un petit écran surtout |

## Versions

**1.0** · 7 novembre 2026 · Première version publique :
- les séances, avec leur haut, leur bas et leur POC ;
- la liquidité au sens ICT et SMC : hauts et bas d'hier, de la semaine, du mois et des séances, sommets et creux égaux, chiffres ronds ;
- la cible de liquidité ;
- les zones H4 : FVG et order blocks ;
- la structure (BOS, CHoCH) et le VWAP, en option ;
- les sweeps BSL et SSL, et les plans de la stratégie d'école, avec leur taille de position ;
- le bilan des plans passés et le feu rouge de la leçon 18 ;
- les alertes.
