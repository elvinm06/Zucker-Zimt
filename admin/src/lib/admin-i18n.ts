/**
 * Admin panel translations. The public site stays German — only the
 * management UI is bilingual, because the people using it may not be.
 *
 * Both dictionaries are typed against the German one, so a missing English
 * key is a compile error rather than a blank label at runtime.
 */
export type AdminLang = 'de' | 'en';

const de = {
  // --- Login ---
  loginTitle: 'Anmelden',
  loginSubtitle: 'Bitte melden Sie sich an, um den Katalog zu verwalten.',
  username: 'Benutzername',
  password: 'Passwort',
  signIn: 'Anmelden',
  signingIn: 'Wird geprüft …',
  loginFailed: 'Anmeldung fehlgeschlagen',

  // --- Dashboard chrome ---
  administration: 'Verwaltung',
  logout: 'Abmelden',
  language: 'Sprache',

  // --- Stats ---
  statTotal: 'Torten gesamt',
  statVisible: 'im Katalog sichtbar',
  statHidden: 'ausgeblendet',

  // --- List ---
  loading: 'Wird geladen …',
  emptyTitle: 'Noch keine Torten angelegt',
  emptyText: 'Legen Sie über „Neue Torte" Ihre erste Torte an.',
  allergensCount: 'Allergene',
  visible: 'Sichtbar',
  hidden: 'Ausgeblendet',
  edit: 'Bearbeiten',
  remove: 'Löschen',
  confirmDelete: (name: string) => `„${name}" wirklich löschen?`,
  loadFailed: 'Laden fehlgeschlagen',
  saveFailed: 'Speichern fehlgeschlagen',
  deleteFailed: 'Löschen fehlgeschlagen',

  // --- Settings ---
  tabProducts: 'Torten',
  tabSettings: 'Einstellungen',
  settingsTitle: 'Kontakt & Marke',
  settingsHint: 'Diese Angaben erscheinen im Kopf, Fuß und in allen Bestell-Links.',
  settingsName: 'Name der Konditorei',
  settingsTagline: 'Slogan',
  settingsWhatsapp: 'WhatsApp-Nummer',
  settingsWhatsappHint: 'Nur Ziffern mit Ländervorwahl, z. B. 4915112345678',
  settingsTelegram: 'Telegram-Benutzername',
  settingsTelegramHint: 'Ohne @, z. B. zuckerundzimt',
  settingsInstagram: 'Instagram-Link',
  settingsPhone: 'Telefon',
  settingsAddress: 'Adresse',
  settingsHours: 'Öffnungszeiten',
  settingsWhatsappError: 'Bitte nur Ziffern eingeben, z. B. 4915112345678',
  settingsTelegramError: 'Nur Buchstaben, Ziffern und _ — ohne @',
  settingsSave: 'Speichern',
  settingsSaved: 'Gespeichert',

  // --- Form ---
  formNewTitle: 'Neue Torte',
  formEditTitle: 'Torte bearbeiten',
  formHint: 'Alle Felder erscheinen direkt im Katalog.',
  backToOverview: 'Zurück zur Übersicht',
  productNotFound: 'Torte nicht gefunden',
  fieldName: 'Name',
  fieldNamePlaceholder: 'z. B. Schokoladentorte',
  fieldPrice: 'Preis (€)',
  fieldImages: 'Bilder',
  cover: 'Titelbild',
  makeCover: 'Als Titelbild',
  imagesLimit: (max: number) => `Maximal ${max} Bilder pro Torte`,
  imagesRemaining: (n: number) =>
    n === 1 ? 'noch 1 Bild möglich' : `noch ${n} Bilder möglich`,
  imageDrop: 'Bild hierher ziehen oder klicken',
  imageHint: 'JPG, PNG, WebP oder GIF · max. 5 MB',
  imageUploading: 'Wird hochgeladen …',
  imageReplace: 'Ersetzen',
  imageRemove: 'Entfernen',
  imageInvalid: 'Bitte wählen Sie eine Bilddatei',
  imageTooLarge: 'Die Datei ist größer als 5 MB',
  imageFailed: 'Upload fehlgeschlagen',
  fieldDescription: 'Beschreibung',
  fieldDescriptionPlaceholder: 'Kurze, appetitliche Beschreibung …',
  ingredients: 'Zutaten',
  ownIngredient: 'Eigene Zutat hinzufügen',
  add: 'Hinzufügen',
  removeChip: 'Entfernen',
  allergens: 'Allergene',
  ownAllergen: 'Eigenes Allergen hinzufügen',
  visibleInCatalog: 'Im Katalog sichtbar',
  saving: 'Wird gespeichert …',
  update: 'Aktualisieren',
  create: 'Hinzufügen',
  cancel: 'Abbrechen',
};

type Dictionary = typeof de;

const en: Dictionary = {
  loginTitle: 'Sign in',
  loginSubtitle: 'Please sign in to manage the catalogue.',
  username: 'Username',
  password: 'Password',
  signIn: 'Sign in',
  signingIn: 'Checking …',
  loginFailed: 'Sign-in failed',

  administration: 'Administration',
  logout: 'Sign out',
  language: 'Language',

  statTotal: 'cakes in total',
  statVisible: 'visible in catalogue',
  statHidden: 'hidden',

  loading: 'Loading …',
  emptyTitle: 'No cakes yet',
  emptyText: 'Create your first cake via "New cake".',
  allergensCount: 'allergens',
  visible: 'Visible',
  hidden: 'Hidden',
  edit: 'Edit',
  remove: 'Delete',
  confirmDelete: (name: string) => `Really delete "${name}"?`,
  loadFailed: 'Loading failed',
  saveFailed: 'Saving failed',
  deleteFailed: 'Deleting failed',

  tabProducts: 'Cakes',
  tabSettings: 'Settings',
  settingsTitle: 'Contact & brand',
  settingsHint: 'These details appear in the header, footer and every order link.',
  settingsName: 'Bakery name',
  settingsTagline: 'Tagline',
  settingsWhatsapp: 'WhatsApp number',
  settingsWhatsappHint: 'Digits only, with country code, e.g. 4915112345678',
  settingsTelegram: 'Telegram username',
  settingsTelegramHint: 'Without @, e.g. zuckerundzimt',
  settingsInstagram: 'Instagram link',
  settingsPhone: 'Phone',
  settingsAddress: 'Address',
  settingsHours: 'Opening hours',
  settingsWhatsappError: 'Digits only, e.g. 4915112345678',
  settingsTelegramError: 'Letters, digits and _ only — without @',
  settingsSave: 'Save',
  settingsSaved: 'Saved',

  formNewTitle: 'New cake',
  formEditTitle: 'Edit cake',
  formHint: 'Every field appears in the public catalogue.',
  backToOverview: 'Back to overview',
  productNotFound: 'Cake not found',
  fieldName: 'Name',
  fieldNamePlaceholder: 'e.g. Chocolate cake',
  fieldPrice: 'Price (€)',
  fieldImages: 'Images',
  cover: 'Cover',
  makeCover: 'Make cover',
  imagesLimit: (max: number) => `At most ${max} images per cake`,
  imagesRemaining: (n: number) =>
    n === 1 ? '1 more image possible' : `${n} more images possible`,
  imageDrop: 'Drag an image here or click',
  imageHint: 'JPG, PNG, WebP or GIF · max. 5 MB',
  imageUploading: 'Uploading …',
  imageReplace: 'Replace',
  imageRemove: 'Remove',
  imageInvalid: 'Please choose an image file',
  imageTooLarge: 'The file is larger than 5 MB',
  imageFailed: 'Upload failed',
  fieldDescription: 'Description',
  fieldDescriptionPlaceholder: 'Short, appetising description …',
  ingredients: 'Ingredients',
  ownIngredient: 'Add your own ingredient',
  add: 'Add',
  removeChip: 'Remove',
  allergens: 'Allergens',
  ownAllergen: 'Add your own allergen',
  visibleInCatalog: 'Visible in catalogue',
  saving: 'Saving …',
  update: 'Update',
  create: 'Add',
  cancel: 'Cancel',
};

export const DICTIONARIES: Record<AdminLang, Dictionary> = { de, en };

export const LANGUAGES: { code: AdminLang; label: string }[] = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
];
