'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const GitaVerseDetail = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (location.state?.verseIndex !== undefined) {
      setCurrentVerseIndex(location.state.verseIndex);
    }
  }, [location.state]);

  const verses = [
    {
      chapter: 2,
      verse: 20,
      sanskrit: "न जायते म्रियते वा कदाचिद् न अयं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥",
      transliteration: "na jāyate mriyate vā kadācid nāyaṁ bhūtvā bhavitā vā na bhūyaḥ ajo nityaḥ śāśvato 'yaṁ purāṇo na hanyate hanyamāne śarīre",
      translation: "The soul is never born, nor does it ever die; nor having once existed, does it ever cease to be. The soul is unborn, eternal, ever-existing, undying, and primeval. It is not slain when the body is slain.",
      commentary: "This profound verse speaks to the eternal nature of consciousness. While the body undergoes birth, growth, decay, and death, the essence of who we are - the soul - remains unchanged. Understanding this truth helps us transcend the fear of death and attachment to the temporary physical form. It's a reminder that we are not merely physical beings having a spiritual experience, but spiritual beings having a physical experience."
    },
    {
      chapter: 2,
      verse: 47,
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
      transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
      translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
      commentary: "This is perhaps one of the most famous verses of the Gita, teaching the principle of detached action. It doesn't mean we shouldn't care about outcomes, but rather that we shouldn't be controlled by them. Focus on giving your best effort, maintaining high standards, and acting with integrity - but release attachment to specific results. This paradoxically often leads to better outcomes while also protecting our mental peace regardless of external results."
    },
    {
      chapter: 3,
      verse: 35,
      sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥",
      transliteration: "śreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣṭhitāt sva-dharme nidhanaṁ śreyaḥ para-dharmo bhayāvahaḥ",
      translation: "It is far better to perform one's natural prescribed duty, though tinged with faults, than to perform another's prescribed duty, though perfectly. In fact, it is preferable to die in the discharge of one's duty, than to follow the path of another, which is fraught with danger.",
      commentary: "In today's world of social media and constant comparison, this verse is especially relevant. It teaches us to honor our own unique path rather than imitating others. Your journey, with all its imperfections, is more valuable than a perfect imitation of someone else's life. Each person has unique talents, circumstances, and purposes. Embrace your authentic self and your own dharma, even if it seems less glamorous than others' paths."
    },
    {
      chapter: 4,
      verse: 7,
      sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
      transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
      translation: "Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself on earth.",
      commentary: "This verse speaks to the cyclical nature of righteousness and the divine response to moral decline. It's a message of hope that even in the darkest times, when dharma seems to be fading, there is always a restoration of balance. On a personal level, this can inspire us to be agents of positive change in our own spheres of influence, standing up for what's right even when it's difficult."
    },
    {
      chapter: 6,
      verse: 5,
      sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
      transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
      translation: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
      commentary: "This powerful verse teaches us about the dual nature of our mind. It can be our greatest ally in spiritual progress and personal growth, or our worst enemy leading us toward negativity and self-destruction. The choice is ours. Through discipline, awareness, and right practice, we can train our mind to be our friend. This requires constant vigilance and effort, but the rewards are immense - inner peace, clarity, and spiritual advancement."
    },
    {
      chapter: 9,
      verse: 22,
      sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
      transliteration: "ananyāś cintayanto māṁ ye janāḥ paryupāsate teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
      translation: "To those who are constantly devoted and who worship Me with love, I give the understanding by which they can come to Me.",
      commentary: "This verse speaks to the divine promise of care and protection for sincere devotees. When we dedicate ourselves fully to spiritual practice and divine connection, the universe conspires to support our journey. This doesn't mean life becomes easy, but rather that we receive the strength, wisdom, and resources needed to navigate our path. It's about developing unwavering faith and trust in the divine plan."
    },
    {
      chapter: 12,
      verse: 13,
      sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च। निर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥",
      transliteration: "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca nirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī",
      translation: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant, always satisfied and engaged in devotional service with determination.",
      commentary: "This verse beautifully describes the qualities of an evolved soul. It's not about perfection, but about the direction of our growth. When we cultivate non-envy, universal friendship, and equanimity, we free ourselves from the constant ups and downs of life. These qualities create inner stability and peace that no external circumstance can disturb. It's a daily practice of choosing kindness, humility, and acceptance."
    },
    {
      chapter: 15,
      verse: 7,
      sanskrit: "ममैवांशो जीवलोके जीवभूतः सनातनः। मनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति ॥",
      transliteration: "mamaivāṁśo jīva-loke jīva-bhūtaḥ sanātanaḥ manaḥ-ṣaṣṭhānīndriyāṇi prakṛti-sthāni karṣati",
      translation: "The living entities in this conditioned world are My eternal fragmental parts. Due to conditioned life, they are struggling very hard with the six senses, which include the mind.",
      commentary: "This verse reminds us of our divine origin - we are not separate from the Divine, but eternal fragments of it. Our struggle in this material world comes from identifying with our body and senses rather than recognizing our spiritual nature. The six senses (five physical senses plus the mind) constantly pull us toward external objects and experiences. Spiritual practice is about reclaiming our true identity and living from that awareness."
    },
    {
      chapter: 16,
      verse: 1,
      sanskrit: "अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः। दानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ॥",
      transliteration: "abhayaṁ sattva-saṁśuddhir jñāna-yoga-vyavasthitiḥ dānaṁ damaś ca yajñaś ca svādhyāyas tapa ārjavam",
      translation: "Fearlessness, purification of one's existence, cultivation of spiritual knowledge, charity, self-control, performance of sacrifice, study of the Vedas, austerity and simplicity.",
      commentary: "This verse begins a list of divine qualities that we should cultivate. Fearlessness comes first because it's the foundation of spiritual growth - fear holds us back from truth and authenticity. Purification of existence means creating a life aligned with our values. These qualities aren't just moral guidelines but practical tools for living a meaningful, fulfilled life. Each quality supports the others, creating a holistic approach to personal and spiritual development."
    },
    {
      chapter: 18,
      verse: 66,
      sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥",
      transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja ahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
      translation: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
      commentary: "This is the culminating message of the Bhagavad Gita - complete surrender to the Divine. It's not about abandoning responsibility or effort, but about releasing our ego's need to control everything. When we surrender, we align ourselves with the natural flow of existence. This doesn't mean passivity, but rather acting from a place of trust and faith rather than anxiety and control. It's the ultimate freedom - freedom from the burden of thinking we must figure everything out alone."
    }
  ];

  const currentVerse = verses[currentVerseIndex];

  const suggestedQuestions = [
    "Explain this verse simply",
    "How does this apply to my life?",
    "What is the deeper meaning?"
  ];

  const getAnswer = (question) => {
    if (question.includes("Explain")) {
      return currentVerse.translation;
    }
    if (question.includes("apply")) {
      return currentVerse.commentary;
    }
    return currentVerse.commentary;
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setCustomQuestion('');
    setCustomAnswer('');
    setMessages([...messages, { type: 'user', text: question }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'krishna', text: getAnswer(question) }]);
    }, 200);
  };

  const handleCustomSubmit = () => {
    if (customQuestion.trim()) {
      const answer = "O seeker, I hear your silent inquiry and understand that you seek clarity amidst the complexities of existence. In this sacred verse, I remind you of the nature of the world around you—the sensations and experiences that impact your senses, creating a tapestry of pleasure and pain. The dualities of cold and heat, joy and sorrow are indeed transient. They come and go, much like the seasons that change, bringing different weathers and moods.";
      setMessages([...messages, { type: 'user', text: customQuestion }, { type: 'krishna', text: answer }]);
      setCustomQuestion('');
      setCustomAnswer(answer);
      setSelectedQuestion(null);
    }
  };

  const handlePrevious = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1);
      setSelectedQuestion(null);
      setCustomQuestion('');
      setCustomAnswer('');
      setMessages([]);
    }
  };

  const handleNext = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
      setSelectedQuestion(null);
      setCustomQuestion('');
      setCustomAnswer('');
      setMessages([]);
    }
  };

  const handleBack = () => {
    router.push(-1);
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0628 0%, #4a187eff 25%, #2a0d51 50%, #390762 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '6px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px'
            }}>
            <span className="material-symbols-outlined">
              arrow_back
            </span>
          </button>
          <button
            onClick={handleHome}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '6px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px'
            }}>
            <span className="material-symbols-outlined">
              home
            </span>
          </button>
          <button style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '6px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto',
            fontSize: '10px'
          }}>
            <span
              className="material-symbols-outlined"
            >
              content_copy
            </span>
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 400px',
          gap: '24px'
        }}>
          {/* Left Column - Verse Details */}
          <div>
            {/* Verse Header Card */}
            <div style={{
              background: 'linear-gradient(135deg, #491868, #401e5f)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px'
                }}>
                  <span className="material-symbols-outlined" style={{
                    color: "#ffffff",
                    fontSize: "22px",
                  }}>
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h1 style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: '0 0 4px 0'
                  }}>
                    Verse of the Day
                  </h1>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    margin: 0,
                    fontSize: '1rem'
                  }}>
                    Chapter {currentVerse.chapter}, Verse {currentVerse.verse}
                  </p>
                </div>
              </div>

              {/* Sanskrit Verse */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px'
              }}>
                <p style={{
                  fontFamily: 'serif',
                  fontSize: '1.5rem',
                  lineHeight: '2.2',
                  color: '#FFD569',
                  textAlign: 'center',
                  margin: 0
                }}>
                  {currentVerse.sanskrit}
                </p>
              </div>

              {/* Transliteration Section */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  background: 'rgba(168, 85, 247, 0.3)',
                  color: '#E9D5FF',
                  fontSize: '0.75rem',
                  padding: '8px 16px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  display: 'inline-block',
                  marginBottom: '16px'
                }}>
                  Transliteration
                </span>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                  fontStyle: 'italic',
                  margin: 0
                }}>
                  {currentVerse.transliteration}
                </p>
              </div>

              {/* Translation Section */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  background: 'rgba(168, 85, 247, 0.3)',
                  color: '#E9D5FF',
                  fontSize: '0.75rem',
                  padding: '8px 16px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  display: 'inline-block',
                  marginBottom: '16px'
                }}>
                  Translation
                </span>
                <p style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  margin: 0,
                  opacity: 0.95
                }}>
                  {currentVerse.translation}
                </p>
              </div>

              {/* Commentary Section */}
              <div>
                <span style={{
                  background: 'rgba(20, 184, 166, 0.3)',
                  color: '#99f6e4',
                  fontSize: '0.75rem',
                  padding: '8px 16px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  display: 'inline-block',
                  marginBottom: '16px'
                }}>
                  Commentary
                </span>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '1.05rem',
                  lineHeight: '1.9',
                  margin: 0
                }}>
                  {currentVerse.commentary}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <button
                onClick={handlePrevious}
                disabled={currentVerseIndex === 0}
                style={{
                  flex: 1,
                  background: currentVerseIndex === 0
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: currentVerseIndex === 0
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'white',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: currentVerseIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                ‹ Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentVerseIndex === verses.length - 1}
                style={{
                  flex: 1,
                  background: currentVerseIndex === verses.length - 1
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'linear-gradient(90deg, #f59e0b, #d97706)',
                  border: 'none',
                  color: currentVerseIndex === verses.length - 1
                    ? 'rgba(255, 255, 255, 0.3)'
                    : '#1a0b2e',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: currentVerseIndex === verses.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div style={{
              background: "linear-gradient(180deg, #41234b, #210e38)",
              borderRadius: "24px",
              padding: "22px",
              height: "700px",
              display: "flex",
              flexDirection: "column",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>

              {/* HEADER - KEPT EXACTLY AS ORIGINAL */}
              <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: '24px',

                }}>
                  <span className="material-symbols-outlined" style={{
                    color: "#ffffff",
                    fontSize: "22px",

                  }}>
                    auto_awesome
                  </span>
                </div>

                <div>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: '1.1rem' }}>Ask Lord Krishna</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: '0.9rem' }}>
                    Suggested Questions
                  </p>
                </div>
              </div>
              <div style={{ height: "1px", width: "100%", background: "rgba(255,255,255,0.15)", marginBottom: 16 }} />

              {/* CHAT CONVERSATION AREA */}
              <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.type === 'user' ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-start" }}>
                    {msg.type === 'krishna' && (
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: '18px'
                      }}>
                        <span className="material-symbols-outlined" style={{ color: "#ffffff", fontSize: "22px" }}>auto_awesome</span>
                      </div>
                    )}
                    <div style={{
                      background: msg.type === 'user' ? "#59297f" : "rgba(255,255,255,0.08)",
                      borderRadius: msg.type === 'user' ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      padding: "12px 16px",
                      maxWidth: "85%",
                      color: msg.type === 'user' ? "#fff" : "rgba(255,255,255,0.9)",
                      fontSize: "0.9rem",
                      lineHeight: 1.7
                    }}>
                      {msg.text}
                    </div>
                    {msg.type === 'user' && (
                      <div style={{
                        marginLeft: 8,
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <span className="material-symbols-outlined" style={{ color: "#ffffff", fontSize: 20 }}>person</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* SUGGESTED QUESTIONS */}
                {!messages.length && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {suggestedQuestions.map((q, i) => (
                      <button key={i} onClick={() => handleQuestionClick(q)}
                        style={{
                          background: "#59297f",
                          border: "none",
                          borderRadius: 14,
                          padding: 18,
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#6b3491"}
                        onMouseLeave={(e) => e.target.style.background = "#59297f"}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* INPUT */}
              <div style={{ position: "relative" }}>
                <input
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
                  placeholder="Ask your own question..."
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 14,
                    padding: "14px 52px 14px 16px",
                    color: "#fff",
                    outline: "none",
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={handleCustomSubmit}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: '20px'
                  }}>
                  <span className="material-symbols-outlined" style={{ color: "#ffffff", fontSize: 20 }}>send</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GitaVerseDetail; 