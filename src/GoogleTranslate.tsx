import { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
import { getCookie, hasCookie, setCookie } from 'cookies-next';

declare global {
    interface Window {
        googleTranslateElementInit?: () => void;
        google: any;
    }
}

const GoogleTranslate = () => {
    const [selected, setSelected] = useState<string | null>(null);

    const languages = [
        { label: '🇺🇸 EN', value: 'en' },
        { label: '🇷🇺 RU', value: 'ru' },
        { label: '🇵🇱 PL', value: 'pl' },
        // ... Ajoutez d'autres langues ici
        { label: '🇫🇷 FR', value: 'fr' },
        { label: '🇪🇸 ES', value: 'es' },
        // ...
    ];

    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({
                pageLanguage: 'auto',
                autoDisplay: false,
                includedLanguages: languages.map(lang => lang.value).join(','),
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
        };

        const addScript = document.createElement('script');
        addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
        document.body.appendChild(addScript);

        if (hasCookie('googtrans')) {
            const cookieValue = getCookie('googtrans');
            setSelected(cookieValue ? cookieValue.toString() : 'en');
        } else {
            setSelected('en');
        }

        return () => {
            document.body.removeChild(addScript);
        };
    }, []);

    const langChange = (value: string | null) => {
        if (value) {
            const langCode = `/auto/${value}`;
            setCookie('googtrans', langCode);
            setSelected(langCode);
            window.location.reload();
        }
    };

    return (
        <>
            <div style={{ height: 100, overflow: 'hidden' }}>
                <div id="google_translate_element"></div>
            </div>
            {languages.length > 0 && (
                <SelectPicker
                    data={languages}
                    style={{ width: 240 }} // Utiliser une largeur raisonnable
                    value={selected}
                    onChange={(value) => langChange(value)}
                    cleanable={false}
                    searchable={false}
                />
            )}
        </>
    );
};

export default GoogleTranslate;
