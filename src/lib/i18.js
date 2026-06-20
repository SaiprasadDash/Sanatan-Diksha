import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      chapter: "Chapter",
      home: "Home",
      panchang: "Panchang",
      geeta: "Geeta",
      feedback: "Feedback",
      practice: "Practice",
      temples: "Temples",
      shop: "Shop",
      signIn: "Sign In",
      signInTitle: "Sign in for personalized experience",
      benefitsTitle: "Sign in benefits:",
      benefit1: "Sync progress across devices",
      benefit2: "Personalized deity selection",
      benefit3: "Custom astrology insights",
      benefit4: "Enable push notifications",
      benefit5: "Full temple interaction features",
      comingSoon: "Coming Soon",
      notifyBtn: "Notify me at launch",
      emailPlaceholder: "Enter your email",
      tagline: "Your spiritual companion powered by AI",

      good_morning: "Good Morning",
      good_afternoon: "Good Afternoon",
      good_evening: "Good Evening",
      good_night: "Good Night",
      cards: {
        dailyPanchang: "Daily Panchang",
        panchangDesc: "Hindu calendar & auspicious times",
        geeta: "Bhagavad Geeta",
        geetaDesc: "Divine wisdom with AI guidance",
        yoga: "Yoga & Meditation",
        yogaDesc: "Mind-body wellness practices",
        temple: "Temple Live",
        templeDesc: "Live darshan from sacred temples",
        templeSubtitle: " Full interactive features coming soon"
      },

      verseOfDay: "Verse of the Day",
      translationLabel: "Translation",
      readExplanation: "Read Explanation",
      share: "Share",
      visitorCount: "Visitor Count",
      ExploreMoreVerses: "Explore More Verses",

      progress: "Progress",
      progressVersesCompleted: "verses completed",
      progressDaysStreak: "days streak",
      progressYogaSessions: "Yoga sessions",
      progressMinutesMeditation: "minutes meditation",

      panchangTitle: "Daily Panchang",
      panchangSubtitle: "Hindu calendar & auspicious times",
      today: "Today",
      tithi: "Tithi",
      nakshatra: "Nakshatra",
      yoga: "Yoga",
      karana: "Karana",
      sunrise: "Sunrise",
      sunset: "Sunset",
      auspiciousTimes: "Auspicious Times",
      inauspiciousTimes: "Inauspicious Times",
      abhijitMuhurat: "Abhijit Muhurat",
      amritKaal: "Amrit Kaal",
      gulikaKalam: "Gulika Kalam",
      yamaKalam: "Yama Kalam",
      rahuKaal: "Rahu Kaal",
      inauspicious: "Inauspicious",
      date: "Date",
      whatIsPanchang: "What is Panchang?",
      panchangDescription: "Panchang is the Hindu calendar that tracks five elements: Tithi, Nakshatra, Yoga, Karana, and Vara (weekday). It helps determine auspicious times for ceremonies and daily activities.",
      geetaTitle: "Bhagavad Geeta",
      geetaSubtitle: "Divine wisdom with AI guidance",
      continueReading: "Continue Reading",
      verses: "verses",
      mins: "mins",
      statusInProgress: "In Progress",
      statusNotStarted: "Not Started",

      progressLabel: "Progress",
      versesLabel: "verses",

      geetaPage: {
        title: "Bhagavad Geeta",
        subtitle: "Divine wisdom with AI guidance",
        continueReading: "Continue Reading",

        chapter: "Chapter",
        verses: "verses",
        mins: "mins",

        statusInProgress: "In Progress",
        statusNotStarted: "Not Started",

        progress: "Progress",
        versesCompleted: "verses",
      },

      chaptersList: {
        1: {
          title: "Arjuna Visada Yoga",
          subtitle: "The Yoga of Arjuna's Grief",
          description: "Arjuna sees his relatives and teachers on the battlefield and is overwhelmed with grief."
        },
        2: {
          title: "Sankhya Yoga",
          subtitle: "The Yoga of Knowledge",
          description: "Krishna introduces the concepts of the eternal soul, duty, and performing action selflessly."
        },
        3: {
          title: "Karma Yoga",
          subtitle: "The Yoga of Action",
          description: "Krishna explains the path of selfless action and work performed as divine service."
        },
        4: {
          title: "Jnana Karma Sannyasa Yoga",
          subtitle: "The Yoga of Knowledge and Renunciation of Action",
          description: "Krishna reveals divine incarnations and explains the differences between knowledge and action."
        },
        5: {
          title: "Karma Sannyasa Yoga",
          subtitle: "The Yoga of Renunciation",
          description: "Krishna discusses renunciation and explains action vs renunciation paths."
        },
        6: {
          title: "Dhyana Yoga",
          subtitle: "The Yoga of Meditation",
          description: "Krishna teaches meditation practice and self-control for spiritual peace."
        },
        7: {
          title: "Jnana Vijnana Yoga",
          subtitle: "The Yoga of Knowledge and Wisdom",
          description: "Krishna reveals His divine nature and explains material/spiritual existence."
        },
        8: {
          title: "Aksara Brahma Yoga",
          subtitle: "The Yoga of the Imperishable Brahman",
          description: "Krishna explains the Supreme Being and the process of leaving the body."
        },
        9: {
          title: "Raja Vidya Raja Guhya Yoga",
          subtitle: "The Yoga of Royal Knowledge and Royal Secret",
          description: "Krishna shares confidential knowledge explaining how the universe exists within Him."
        },
        10: {
          title: "Vibhuti Yoga",
          subtitle: "The Yoga of Divine Glories",
          description: "Krishna describes His infinite divine manifestations throughout creation."
        },
        11: {
          title: "Visvarupa Darsana Yoga",
          subtitle: "The Vision of the Universal Form",
          description: "Krishna reveals His cosmic form displaying infinite power."
        },
        12: {
          title: "Bhakti Yoga",
          subtitle: "The Yoga of Devotion",
          description: "Krishna explains the path of devotion and qualities dear to Him."
        }
      },

      yogaPage: {
        yogasana: "Yoga Asanas",
        meditation: "Guided Meditation",
        daysstreak: "days streak",
        yogasession: "Yoga sessions",
        time: "time"
      },

      feedbackk: {
        name: "Your Name (optional)",
        message: "Write your feedback...",
        submit: "Submit Feedback",
        submitting: "Submitting...",
        title: "Feedback",
        subtitle: "Help us improve your experience",
        success: "Thanks for your feedback 🙏",
        captcha: "Enter Captcha",
        referral: "Referral (Optional)",
        refresh: "Refresh",
      },

      // Coming Soon Page Translations
      comingSoonPage: {
        title: "Coming Soon",
        subtitle: "We're working on exciting new features to enrich your spiritual journey even further.",
        badge: "Coming Soon",
        features: {
          yogaVideos: {
            title: "Yoga Videos",
            description: "Deepen your yoga practice with guided video tutorials by expert instructors."
          },
          dashboard: {
            title: "Personalized Dashboard",
            description: "Important dates, festivals, and personalized reminders tailored to your spiritual journey."
          },
          deityAvatar: {
            title: "Talk to Your Deity Avatar",
            description: "Engage in conversations with AI avatars of your favorite deities for personalized guidance."
          }
        },
        notify: {
          title: "Get Notified at Launch",
          subtitle: "Be the first to know when these new features go live.",
          placeholder: "Your email",
          button: "Notify Me",
          success: "✅ Thank you! You'll be notified when we launch. Stay blessed 🙏"
        },
        footer: "💜 Your feedback makes us better. Please share your thoughts!"
      },
      cosmicProfile: {
        "title": "Your Cosmic Profile",
        "subtitle": "Vedic Astrology · Today's Insight",
        "rashi": "Rashi",
        "nakshatra": "Nakshatra",
        "lagna": "Lagna",
        "sunSign": "Sun Sign",
        "currentDasha": "Current Dasha",
        "tithi": "Tithi",
        "yoga": "Yoga",
        "vaara": "Vaara",
        "dashaActive": "Dasha is active",
        "dasha": "Dasha"
      }
    },
  },

  hi: {
    translation: {
      chapter: "अध्याय",
      mins: "मिनट",
      verses: "श्लोक",
      home: "होम",
      panchang: "पंचांग",
      feedback: "सुझाव",
      geeta: "गीता",
      practice: "अभ्यास",
      temples: "मंदिर",
      shop: "दुकान",
      signIn: "साइन इन",
      signInTitle: "व्यक्तिगत अनुभव के लिए साइन इन करें",
      benefitsTitle: "साइन इन लाभ:",
      benefit1: "उपकरणों के बीच प्रगति सिंक करें",
      benefit2: "व्यक्तिगत देवता चयन",
      benefit3: "कस्टम ज्योतिष अंतर्दृष्टि",
      benefit4: "पुश नोटिफिकेशन सक्षम करें",
      benefit5: "पूर्ण मंदिर इंटरैक्शन सुविधाएँ",
      comingSoon: "जल्द आ रहा है",
      notifyBtn: "लॉन्च पर मुझे सूचित करें",
      emailPlaceholder: "अपना ईमेल दर्ज करें",
      tagline: "आपका आध्यात्मिक साथी AI द्वारा संचालित",

      good_morning: "सुप्रभात",
      good_afternoon: "शुभ दोपहर",
      good_evening: "शुभ संध्या",
      good_night: "शुभ रात्रि",

      cards: {
        dailyPanchang: "दैनिक पंचांग",
        panchangDesc: "हिंदू कैलेंडर और शुभ समय",
        geeta: "भगवद् गीता",
        geetaDesc: "ईश्वरीय ज्ञान AI मार्गदर्शन के साथ",
        yoga: "योग और ध्यान",
        yogaDesc: "मन-शरीर स्वास्थ्य अभ्यास",
        temple: "मंदिर लाइव",
        templeDesc: "पवित्र मंदिरों से लाइव दर्शन",
        templeSubtitle: "सभी इंटरैक्टिव सुविधाएँ जल्द ही आ रही हैं"
      },
      cosmicProfile: {
        "title": "आपकी ब्रह्मांडीय प्रोफ़ाइल",
        "subtitle": "वैदिक ज्योतिष · आज की अंतर्दृष्टि",
        "rashi": "राशि",
        "nakshatra": "नक्षत्र",
        "lagna": "लग्न",
        "sunSign": "सूर्य राशि",
        "currentDasha": "वर्तमान दशा",
        "tithi": "तिथि",
        "yoga": "योग",
        "vaara": "वार",
        "dashaActive": "दशा सक्रिय है",

        "dasha": "दशा"
      },
      verseOfDay: "आज का श्लोक",
      translationLabel: "अनुवाद",
      readExplanation: "व्याख्या पढ़ें",
      share: "साझा करें",

      ExploreMoreVerses: "और श्लोक देखें",
      visitorCount: "दर्शक संख्या",
      progress: "प्रगति",
      progressVersesCompleted: "श्लोक पूर्ण",
      progressDaysStreak: "दिनों की लकीर",
      progressYogaSessions: "योग सत्र",
      progressMinutesMeditation: "ध्यान मिनट",

      panchangTitle: "दैनिक पंचांग",
      panchangSubtitle: "हिंदू कैलेंडर और शुभ समय",
      today: "आज",
      tithi: "तिथि",
      nakshatra: "नक्षत्र",
      yoga: "योग",
      karana: "करण",
      sunrise: "सूर्योदय",
      sunset: "सूर्यास्त",
      auspiciousTimes: "शुभ समय",
      inauspiciousTimes: "अशुभ समय",
      abhijitMuhurat: "अभिजीत मुहूर्त",
      amritKaal: "अमृत काल",
      gulikaKalam: "गुलिक काल",
      yamaKalam: "यमगंड काल",
      rahuKaal: "राहु काल",
      inauspicious: "अशुभ",
      date: "तारीख",
      whatIsPanchang: "पंचांग क्या है?",
      panchangDescription: "पंचांग हिंदू कैलेंडर है जो पाँच तत्वों को दर्शाता है: तिथि, नक्षत्र, योग, करण और वार (सप्ताह का दिन)। यह शुभ मुहूर्त, धार्मिक कार्यों और दैनिक गतिविधियों के लिए उपयुक्त समय निर्धारित करने में मदद करता है।",

      // 🔥 Added Panchang Dynamic Translations
      panchangValues: {
        paksha: {
          "Pausha Shukla Paksha": "पौष शुक्ल पक्ष",
          "Magha Shukla Paksha": "माघ शुक्ल पक्ष"
        },
        tithi: {
          "Ekadashi": "एकादशी",
          "Dwadashi": "द्वादशी",
          "Trayodashi": "त्रयोदशी"
        },
        nakshatra: {
          "Ashwini": "अश्विनी",
          "Bharani": "भरणी",
          "Krittika": "कृत्तिका"
        },
        yoga: {
          "Sukarma": "सुकर्मा",
          "Shobhana": "शोभन",
          "Vyaghata": "व्याघात"
        },
        karana: {
          "Taitila": "तैतिल",
          "Garaja": "गरज",
          "Bava": "बव"
        }
      },

      geetaPage: {
        title: "भगवद् गीता",
        subtitle: "ईश्वरीय ज्ञान AI मार्गदर्शन के साथ",
        continueReading: "पढ़ना जारी रखें",

        statusInProgress: "चालू है",
        statusNotStarted: "शुरू नहीं हुआ",

        progress: "प्रगति",
        versesCompleted: "श्लोक",
      },

      chaptersList: {
        1: {
          title: "अर्जुन विषाद योग",
          subtitle: "अर्जुन के विषाद का योग",
          description: "अर्जुन युद्धभूमि में अपने संबंधियों और गुरुजनों को देखकर विषाद से भर जाता है।"
        },
        2: {
          title: "सांख्य योग",
          subtitle: "ज्ञान का योग",
          description: "कृष्ण आत्मा, कर्तव्य और निःस्वार्थ कर्म के सिद्धांत बताते हैं।"
        },
        3: {
          title: "कर्म योग",
          subtitle: "कर्म का योग",
          description: "कृष्ण निःस्वार्थ कर्म और ईश्वरार्पित कर्म के महत्व को बताते हैं।"
        },
        4: {
          title: "ज्ञान कर्म संन्यास योग",
          subtitle: "ज्ञान और कर्म संन्यास का योग",
          description: "कृष्ण अवतारों का रहस्य और ज्ञान–कर्म के अंतर बताते हैं।"
        },
        5: {
          title: "कर्म संन्यास योग",
          subtitle: "संन्यास का योग",
          description: "कृष्ण त्याग और कर्म मार्ग दोनों की तुलना करते हैं।"
        },
        6: {
          title: "ध्यान योग",
          subtitle: "ध्यान का योग",
          description: "कृष्ण ध्यान और आत्म-नियंत्रण की साधना सिखाते हैं।"
        },
        7: {
          title: "ज्ञान विज्ञान योग",
          subtitle: "ज्ञान और विज्ञान का योग",
          description: "कृष्ण अपनी दिव्य प्रकृति और सृष्टि के रहस्यों को बताते हैं।"
        },
        8: {
          title: "अक्षर ब्रह्म योग",
          subtitle: "अक्षर ब्रह्म का योग",
          description: "कृष्ण परमात्मा की प्रकृति और मृत्यु के समय आत्मा की यात्रा बताते हैं।"
        },
        9: {
          title: "राजविद्या राजगुह्य योग",
          subtitle: "राजविद्या और राजगुह्य का योग",
          description: "कृष्ण अत्यंत गोपनीय ज्ञान बताते हैं और ब्रह्मांड उनके भीतर कैसे स्थित है समझाते हैं।"
        },
        10: {
          title: "विभूति योग",
          subtitle: "दिव्य विभूतियों का योग",
          description: "कृष्ण अपनी अनंत दिव्य विभूतियों का वर्णन करते हैं।"
        },
        11: {
          title: "विश्वरूप दर्शन योग",
          subtitle: "विश्वरूप दर्शन का योग",
          description: "कृष्ण अपना विराट cosmic स्वरूप अर्जुन को दिखाते हैं।"
        },
        12: {
          title: "भक्ति योग",
          subtitle: "भक्ति का योग",
          description: "कृष्ण भक्ति मार्ग और प्रिय भक्तों के गुण बताते हैं।"
        }
      },

      yogaPage: {
        yogasana: "योगासन",
        meditation: "मार्गदर्शित ध्यान",
        daysstreak: "लगातार दिन",
        yogasession: "योग सत्र",
        time: "समय"
      },

      feedbackk: {
        name: "आपका नाम (वैकल्पिक)",
        message: "अपनी प्रतिक्रिया लिखें...",
        submit: "प्रतिक्रिया सबमिट करें",
        submitting: "भेजा जा रहा है...",
        title: "प्रतिक्रिया",
        subtitle: "आपका अनुभव बेहतर बनाने में हमारी मदद करें",
        success: "आपकी प्रतिक्रिया के लिए धन्यवाद 🙏",
        captcha: "कैप्चा दर्ज करें",
        referral: "संदर्भ (वैकल्पिक)",
        refresh: "पुनः लोड करें",
      },

      // Coming Soon Page Translations
      comingSoonPage: {
        title: "जल्द आ रहा है",
        subtitle: "हम आपकी आध्यात्मिक यात्रा को और समृद्ध करने के लिए रोमांचक नई सुविधाओं पर काम कर रहे हैं।",
        badge: "जल्द आ रहा है",
        features: {
          yogaVideos: {
            title: "योग वीडियो",
            description: "विशेषज्ञ प्रशिक्षकों द्वारा निर्देशित वीडियो ट्यूटोरियल के साथ अपनी योग साधना को गहरा करें।"
          },
          dashboard: {
            title: "व्यक्तिगत डैशबोर्ड",
            description: "आपकी आध्यात्मिक यात्रा के अनुरूप महत्वपूर्ण तिथियां, त्योहार और व्यक्तिगत अनुस्मारक।"
          },
          deityAvatar: {
            title: "अपने देवता अवतार से बात करें",
            description: "व्यक्तिगत मार्गदर्शन के लिए अपने पसंदीदा देवताओं के AI अवतारों के साथ बातचीत करें।"
          }
        },
        notify: {
          title: "लॉन्च पर सूचना प्राप्त करें",
          subtitle: "जब ये नई सुविधाएं लाइव होंगी तो सबसे पहले जानें।",
          placeholder: "आपका ईमेल",
          button: "मुझे सूचित करें",
          success: "✅ धन्यवाद! जब हम लॉन्च करेंगे तो आपको सूचित किया जाएगा। धन्य रहें 🙏"
        },
        footer: "💜 आपकी प्रतिक्रिया हमें बेहतर बनाती है। कृपया अपने विचार साझा करें!"
      },
    },
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;