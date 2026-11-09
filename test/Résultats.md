# Ce que disent les tests

La stratégie d'école de la leçon 16, rejouée en H1 sur les données horaires de Yahoo par `test_actifs.js`. Chaque trade gagne environ 2R ou perd environ 1R, frais déduits. La marge du hasard est de deux écarts-types : un résultat qui reste dans cette marge n'est pas un avantage démontré. Le premier tableau laisse de côté la zone H4 (condition 2), rejouée plus bas.

| Marché | Trades | Gagnants | Par trade | Marge du hasard |
|---|---|---|---|---|
| Forex, 8 paires, marge en pips (la leçon 16) | 664 | 34 % | 0,00R | ±0,11R |
| Forex, 8 paires, marge en ATR | 718 | 35 % | +0,01R | ±0,11R |
| Or (futures COMEX), depuis juillet 2024 | 103 | 40 % | +0,17R | ±0,28R |
| Bitcoin, depuis décembre 2024 | 65 | 42 % | +0,18R | ±0,35R |
| Ether, depuis décembre 2024 | 54 | 43 % | +0,23R | ±0,39R |
| S&P 500 (futures), depuis juillet 2024 | 78 | 35 % | −0,02R | ±0,32R |
| Nasdaq 100 (futures), depuis juillet 2024 | 89 | 33 % | −0,03R | ±0,30R |
| DAX (séance au comptant), depuis janvier 2024 | 39 | 44 % | +0,13R | ±0,45R |
| **Or, crypto et indices, ensemble** | 428 | 38 % | +0,10R | ±0,14R |

## Année par année

| Marché | 2024 | 2025 | 2026 |
|---|---|---|---|
| Or (futures COMEX) | +0,42R (23) | +0,22R (54) | −0,13R (26) |
| Bitcoin | +0,95R (3) | +0,20R (31) | +0,09R (31) |
| Ether | +0,48R (2) | +0,52R (25) | −0,04R (27) |
| S&P 500 (futures) | +0,15R (18) | +0,11R (39) | −0,41R (21) |
| Nasdaq 100 (futures) | −0,37R (14) | −0,01R (42) | +0,09R (33) |
| DAX (séance au comptant) | +0,68R (11) | +0,70R (10) | −0,52R (18) |

Entre parenthèses, le nombre de trades.

## Avec la zone H4

La condition 2 en plus, telle que l'indicateur la vérifie : la mèche touche un order block ou un FVG H4 encore intact, de moins de 30 jours, et la clôture ne le traverse pas. Les supports, jugés à l'œil, n'y sont pas.

| Marché | Trades | Gagnants | Par trade | Marge du hasard |
|---|---|---|---|---|
| Forex, 8 paires, marge en pips | 471 | 36 % | +0,04R | ±0,13R |
| Or (futures COMEX) | 67 | 42 % | +0,23R | ±0,35R |
| Bitcoin | 45 | 38 % | +0,08R | ±0,42R |
| Ether | 38 | 39 % | +0,14R | ±0,46R |
| S&P 500 (futures) | 59 | 34 % | −0,02R | ±0,37R |
| Nasdaq 100 (futures) | 69 | 33 % | −0,01R | ±0,34R |
| DAX (séance au comptant) | 32 | 44 % | +0,14R | ±0,50R |
| **Or, crypto et indices, ensemble** | 310 | 38 % | +0,09R | ±0,16R |

## Les règles du test

- **Les mêmes que la leçon 16** : sens donné par l'EMA 200 daily, mèche au-delà du dernier swing H1 intact, ordre stop au-delà du swing qui la précède, stop au-delà de la mèche, objectif 2R. Ordre posé à 8 h, 12 h 30 ou 18 h 30 (Paris), en semaine, au premier passage après le moment où le plan est connu : la clôture de la mèche, ou la bougie suivante si celle d'avant la mèche peut encore devenir le dernier swing. Annulé après 24 h ou si le prix touche le stop avant.
- **Deux approximations**, faute de voir dans une bougie H1 : la bougie qui contient l'heure de pose compte comme après la pose ; pendant l'attente, une bougie qui touche l'entrée et le stop compte comme annulée ; une bougie qui touche le stop et l'objectif compte comme perdante.
- **La marge du stop et le décalage de l'ordre** passent en ATR 14 H1 hors du forex : 0,46 ATR et 0,09 ATR valent 5 pips et 1 pip sur l'EUR/USD, dont l'ATR médian est de 10,8 pips.
- **Les bougies H4** sont alignées comme sur TradingView : 17 h à New York pour le forex, 18 h pour les futures du CME, minuit UTC pour la crypto, 9 h à Paris pour le DAX.
- **Un gap** au-delà de l'entrée ou du stop s'exécute à l'ouverture.
- **Les frais**, aller-retour : 1 pip sur le forex, 0,30 $ sur l'or, 0,1 % du prix sur la crypto, 0,5 point sur le S&P 500, 1,2 point sur le Nasdaq 100 et le DAX.
- **Les limites** : deux à trois ans de données horaires seulement, la limite de Yahoo ; l'or, le S&P 500 et le Nasdaq sont rejoués sur les futures, dont les changements d'échéance créent de petits sauts ; le DAX sur sa seule séance au comptant, de 9 h à 17 h 30.
