# Styling Gids

Dit document beschrijft de stylingregels en conventies die worden gebruikt in dit project.

## Componenten

### Product Information Card

De `ProductInformation` component is de hoofdcontainer voor het productinformatieformulier.

-   **Layout**: Een flex-container met een verticale opstelling (`flex-col`) en een `gap` van `6`. De kaart heeft een padding van `8`.
-   **Afmetingen**: Vaste breedte van `81px`.
-   **Uiterlijk**: Witte achtergrond (`bg-white`), afgeronde hoeken (`rounded-[6px]`) en een grijze rand (`border border-[#E4E4E7]`).

### Formulier Velden

Styling voor de input-elementen en labels binnen de `ProductInformation` card.

-   **Label**:
    -   Vaste breedte van `200px`.
    -   Gecentreerde tekst, `font-medium`, grijze kleur (`text-gray-700`).
    -   Een rode asterisk (`text-red-500`) geeft een verplicht veld aan.
-   **Input & Select**:
    -   Basis styling omvat een hoogte van `10`, afgeronde hoeken, een grijze rand (`border-solid border-[var(--base-input,#E4E4E7)]`) en een witte achtergrond.
    -   Focus state wordt aangegeven met een ring (`focus-visible:ring-2 focus-visible:ring-ring`).

### Button

-   **Standaard (donker)**: Gebruikt voor primaire acties zoals 'Copy to'.
    -   Achtergrond: `var(--base-foreground,#18181B)`.
    -   Tekst: `text-primary-foreground`.
    -   Padding: `px-4 py-2.5`.
-   **Outline**: Gebruikt voor secundaire acties.
-   **Icon**: Een vierkante knop (`h-10 w-10`) specifiek voor iconen, meestal met een outline variant.

### Badge

Wordt gebruikt om aan te geven op welk niveau een attribuut verschilt (bijv. 'V-C').

-   **Variant**: `outline`.
-   **Tekst**: `text-xs font-semibold`.
-   **Gedrag**: `cursor-help` om aan te geven dat er een tooltip aan gekoppeld is.

### CopyAction Component

Dit component bevat de 'Copy' icon button en de bijbehorende dialog (modal). De logica en de content voor de dialog zijn volledig binnen dit component opgenomen.

-   **Header**: Bevat een `DialogTitle` en `DialogDescription`.
-   **Content**: De radio-opties voor het kopiëren hebben een rand, padding en een hover-effect (`hover:bg-gray-50`).
-   **Footer**: Bevat de 'Close' en 'Copy to' knoppen.

### Tooltip

Wordt gebruikt in combinatie met de `Badge` om de volledige beschrijving van de verschillen te tonen.

-   **Uitlijning**: Gecentreerd (`align="center"`) ten opzichte van de trigger.

### Toast Component

De `Toast` component wordt gebruikt om notificaties aan de gebruiker te tonen.

#### Positionering en Layout

-   **Positionering**: De toast heeft een `fixed` positie.
-   **Uitlijning**:
    -   Horizontaal: Gecentreerd in de viewport.
    -   Verticaal: 32px vanaf de bovenkant van de viewport.
-   **Afmetingen**: De toast heeft een vaste breedte van `500px`.

#### Uiterlijk

-   **Achtergrond**: Een donkergroene achtergrond (`bg-[var(--tailwind-colors-green-700,#15803D)]`).
-   **Tekst**: Witte tekst.
-   **Rand**: Een lichte, semi-transparante rand en afgeronde hoeken.
-   **Schaduw**: Een subtiele schaduw voor diepte.

#### Gedrag en Animaties

-   **Duur**: De toast verdwijnt automatisch na 3 seconden.
-   **Tijdsbalk**: Een 2px hoge, blauwe tijdsbalk aan de onderkant van de toast visualiseert de resterende tijd. Deze balk loopt in 3 seconden leeg.
-   **Animaties**:
    -   **Verschijnen (`toast-in`)**: De toast animeert in 0.3 seconden vanaf de bovenkant naar zijn positie met een `ease-out` effect. Hij fade tegelijkertijd in.
    -   **Verdwijnen (`toast-out`)**: De toast animeert in 0.3 seconden naar boven uit beeld met een `ease-in` effect. Hij fade tegelijkertijd uit.

#### Code Voorbeeld (`Toast.jsx`)

De animaties en de tijdsbalk worden direct in de component gedefinieerd met behulp van inline `<style>` en `@keyframes`.

```jsx
@keyframes toast-in {
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
```

### Text large/leading-normal

color: var(--base-foreground, #18181B);

/* text large/leading-normal/semibold */
font-family: var(--typography-font-family-font-sans, Inter);
font-size: var(--typography-base-sizes-large-font-size, 18px);
font-style: normal;
font-weight: var(--font-weight-semibold, 600);
line-height: var(--typography-base-sizes-large-line-height, 28px); /* 155.556% */

### Text small/leadingnormal

color: var(--base-muted-foreground, #71717A);

/* text small/leading-normal/regular */
font-family: var(--typography-font-family-font-sans, Inter);
font-size: var(--typography-base-sizes-small-font-size, 14px);
font-style: normal;
font-weight: var(--font-weight-normal, 400);
line-height: var(--typography-base-sizes-small-line-height, 20px); /* 142.857% */
