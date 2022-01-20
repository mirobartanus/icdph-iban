# icdph-iban

Konverzia IČ DPH na IBAN.
Využíva opendata.financnasprava.sk API.
Pracuje v prostredí `node.js` a CLI.

## Predpoklady

* nainštalované `node.js` prostredie, viac na https://nodejs.org/en/download/

## Stiahnutie a inštalácia 

### Inštalácia CLI

```bash
git clone https://github.com/mirobartanus/icdph-iban.git
cd icdph-iban
npm install
npm link
```

### Odinštalovanie CLI verzie

```bash
cd icdph-iban
npm unlink
cd ..
rmdir /s icdph-iban
```

### Inštalovanie `node.js` package

```
TODO
```

## API_KEY

### Získanie API_KEY

* Vygenerujte a aktivujte API kľúč na https://opendata.financnasprava.sk/page/openapi

### Konfigurovanie API_KEY pre CLI

* V adresári kde je nainštalovaný `icdph-iban`
  * Skopírujte prázdny `.env.example` do `.env`
  * Prepíšte `API_KEY` v `.env` aktivovaným kľúčom

Príklad `.env`
```
API_KEY=ZyAGg99lbSB1ikVsfhlYHQx1nddoFC93Dq0qPn...
```

Alternatívne, v termináli nastavte ENV premennú (Windows 10 `cmd.exe`)
```
set API_KEY=ZyAGg99lbSB1ikVsfhlYHQx1nddoFC93Dq0qPn...
```

### Konfigurovanie API_KEY v node.js

```js
// TODO
setApiKey(process.env.API_KEY);
```

## CLI

Použitie

```bash
icdph-iban -h
icdph-iban [-v] [-a] IC_DPH1 IC_DPH2 IC_DPH3...
icdph-iban [-v] [-a] in.xlsx
icdph-iban [-v] [-a] in.xlsx out.xlsx
icdph-iban [-v] [-a] in.xlsx IC_DPH1... out.xlsx
icdph-iban [-v] [-a] in.xlsx IC_DPH1 IC_DPH2...
icdph-iban [-v] [-a] IC_DPH1 IC_DPH2 IC_DPH3... out.xlsx
```

Prepínače:

```bash
-h        ... help
-v        ... verbose
-a        ... výstup aj chybných záznamov, nielen úspešných
in.xlsx   ... názov vstupného excel súboru
out.xlsx  ... názov výstupného excel súboru
```

Príklady:

```bash
icdph-iban SK2020269922
icdph-iban icdph.xlsx
icdph-iban -v icdph.xlsx iban.xlsx
icdph-iban SK2020269922 dynatech.xlsx
```

### Zisti IBAN pre jedno IČ DPH. Výstup na terminál:
```bash
icdph-iban SK2020269922
```

Výstup:
```
[
  {
    nazov_subjektu: 'Dynatech s.r.o.',
    ic_dph: 'SK2020269922',
    iban: 'SK2211000000002928849342',
    ico: '35737581',
    obec: 'Bratislava - mestská časť Rača',
    ulica_cislo: 'Hečkova 7461/10',
    psc: '83105',
    stat: 'SK'
  }
]
```

### Zisti IBAN pre viac IČ DPH. Výstup na terminál:
```bash
icdph-iban SK2020269922 SK2020220862 SK2021787801
```
### Zisti IBAN pre viac IČ DPH. Výstup do excelu:
```bash
icdph-iban SK2020269922 SK2020220862 SK2021787801 iban.xlsx
```

### Zisti IBAN pre viac IČ DPH uložených v exceli. Výstup na terminál:
```bash
icdph-iban icdph.xlsx
```

Formát vstupného XLSX súboru [icdph.xlsx](icdph.xlsx) :

| interny_nazov          | ic_dph       |
| ---------------------- | ------------ |
| Dynatech               | SK2020269922 |
| VOLKSWAGEN             | SK2021787801 |
| CHYBNÁ POLOŽKA, s.r.o. | SK2820569154 |
| Kia                    | SK2021787801 |

* načítava sa len prvý excel sheet
* povinný je len stĺpec `ic_dph`


### Zisti IBAN pre viac IČ DPH uložených v exceli. Výstup do excelu:
```bash
icdph-iban -v icdph.xlsx iban.xlsx
```

Formát výstupného XLSX súboru [iban.xlsx](iban.xlsx) :

| nazov_subjektu            | ic_dph       | iban                     | ico      | obec                                | ulica_cislo                 | psc   | stat | error                 | interny_nazov (atď)    |
| ------------------------- | ------------ | ------------------------ | -------- | ----------------------------------- | --------------------------- | ----- | ---- | --------------------- | ---------------------- |
| Dynatech s.r.o.           | SK2020269922 | SK2211000000002928849342 | 35737581 | Bratislava - mestská časť Rača      | Hečkova 7461/10             | 83105 | SK   |                       |                        |
| VOLKSWAGEN SLOVAKIA, a.s. | SK2020220862 | SK7280500000000070008059 | 35757442 | Bratislava - m.č. Devínska Nová Ves | J. Jonáša 1                 | 84302 | SK   |                       |                        |
|                           |              | SK9011000000002623007312 |          |                                     |                             |       |      |                       |                        |
|                           | SK2820569154 |                          |          |                                     |                             |       |      | IČ DPH nebolo nájdené | CHYBNÁ POLOŽKA, s.r.o. |
| Kia Slovakia s. r. o.     | SK2021787801 | SK0681300000002006760704 | 35876832 | Teplička nad Váhom                  | Sv. Jána Nepomuckého 1282/1 | 84302 | SK   |                       |                        |
|                           |              | SK1902000000001809203253 |          |                                     |                             |       |      |                       |                        |
|                           |              | SK2881300000002006760405 |          |                                     |                             |       |      |                       |                        |
|                           |              | SK3381300000002006760800 |          |                                     |                             |       |      |                       |                        |

## Poznámky a obmedzenia

* V prípade, že dané IČ DPH má zaregistrovaných viacero účtov, tieto sú uvedené v samostatných riadkoch pod ním a je vyplnené len pole `IBAN`
* V prípade, že nie je možné dané IČ DPH vyhľadať, tak sú vyplnené len polia `ic_dph`, `interny_nazov` a `error`
* `API_KEY` je limitovaný na 1000 požiadaviek za 1 hodinu
* Príklaz `icdph-iban` funguje z ľubovoľného adresára
* Vyvinuté a otestované na prostredí Windows 10:

```
node -v
v14.18.1
```

```
npm -v
6.14.15
```

```
systeminfo
...
OS Name:    Microsoft Windows 10 Pro
OS Version: 10.0.19042 N/A Build 19042
...
```
