import { useEffect, useState } from 'react';

export default function FooterComponent() {
  const [showPushUnsubscribe, setShowUnsubscribe] = useState(false);

    // Also read if we need to offer unsubscribe after rendering
    useEffect(() => {
      let updatePushStatus = async () => {
        let isPNE = await window.OneSignal.isPushNotificationsEnabled();
        setShowUnsubscribe(isPNE);
      };
  
      window.OneSignal.push(updatePushStatus);
  
      window.OneSignal.push(function() {
        window.OneSignal.on('subscriptionChange', updatePushStatus);
      });
    });

    return (
      <footer>
        <p>Engineered with ❤️ in Aachen.</p>
        { showPushUnsubscribe &&
          <p><button href="#" className="removeConsentButton"
          onClick={() => {window.OneSignal.push(["setSubscription", false]);alert("Wir werden Dir keine Benachrichtigungen mehr senden!");}}>
          Zustimmung für Push-Benachrichtigungen widerrufen</button></p>
        }
      </footer>
    );
}