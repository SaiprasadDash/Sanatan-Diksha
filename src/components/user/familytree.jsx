'use client';

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const FamilyTree = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";
const toHindiNumerals = (num) => {
  const hindiDigits = ["०","१","२","३","४","५","६","७","८","९"];
  return String(num).replace(/[0-9]/g, (d) => hindiDigits[d]);
};
  const t = {
    greeting:         isHindi ? "पारिवारिक वृक्ष"                        : "Parivar Vruksha",
    pageTitle:        isHindi ? "आपका पारिवारिक वृक्ष"                   : null, // handled inline with name
    gotraLabel:       isHindi ? "गोत्र"                                   : "Gotra",
    edit:             isHindi ? "संपादित करें"                            : "Edit",

    // stats
    familyMembers:    isHindi ? "परिवार के सदस्य"                         : "Family Members",
    pitras:           isHindi ? "पितर"                                    : "Pitras",
    ancestors:        isHindi ? "पूर्वज"                                  : "Ancestors",
    children:         isHindi ? "बच्चे"                                   : "Children",

    // heritage
    kuldevi:          isHindi ? "कुलदेवी"                                 : "Kuldevi",
    kuldevta:         isHindi ? "कुलदेवता"                                : "Kuldevta",
    gotra:            isHindi ? "गोत्र"                                   : "Gotra",
    nakshatra:        isHindi ? "नक्षत्र"                                 : "Nakshatra",

    // tree labels
    genIII:           isHindi ? "परदादा-परदादी · पीढ़ी III"               : "Great Grandparents · Generation III",
    genII:            isHindi ? "दादा-दादी / नाना-नानी · पीढ़ी II"        : "Grandparents · Generation II",
    genI:             isHindi ? "माता-पिता · पीढ़ी I"                     : "Parents · Generation I",
    nextGen:          isHindi ? "बच्चे · अगली पीढ़ी"                      : "Children · Next Generation",
    pitraLoka:        isHindi ? "पितृलोक"                                 : "Pitra Loka",
    you:              isHindi ? "◉ आप"                                    : "◉ YOU",

    // person relations
    greatGrandfather: isHindi ? "परदादा"                                  : "Great Grandfather",
    greatGrandmother: isHindi ? "परदादी"                                  : "Great Grandmother",
    paternalGrandfather: isHindi ? "दादा"                                 : "Paternal Grandfather",
    paternalGrandmother: isHindi ? "दादी"                                 : "Paternal Grandmother",
    maternalGrandfather: isHindi ? "नाना"                                 : "Maternal Grandfather",
    maternalGrandmother: isHindi ? "नानी"                                 : "Maternal Grandmother",
    father:           isHindi ? "पिता"                                    : "Father",
    mother:           isHindi ? "माता"                                    : "Mother",
    brother:          isHindi ? "भाई"                                     : "Brother",
    sister:           isHindi ? "बहन"                                     : "Sister",
    husband:          isHindi ? "पति"                                     : "Husband",
    wife:             isHindi ? "पत्नी"                                   : "Wife",
    son:              isHindi ? "पुत्र"                                   : "Son",
    daughter:         isHindi ? "पुत्री"                                  : "Daughter",
    addRelation:      isHindi ? "रिश्ता जोड़ें"                           : "Add Relation",

    // bottom actions
    addMember:        isHindi ? "सदस्य जोड़ें"                            : "Add Member",
    pitraLog:         isHindi ? "पितृ लॉग"                                : "Pitra Log",
    shareTree:        isHindi ? "वृक्ष साझा करें"                         : "Share Tree",

    // modal
    editTitle:        isHindi ? "✏️ पारिवारिक विवरण संपादित करें"        : "✏️ Edit Family Details",
    fullName:         isHindi ? "आपका पूरा नाम"                           : "Your Full Name",
    saveChanges:      isHindi ? "परिवर्तन सहेजें"                         : "Save Changes",
    cancel:           isHindi ? "रद्द करें"                               : "Cancel",
  };

  const fname = localStorage?.getItem?.("fname") || "Priya";

  const today = new Date();
 const WEEKDAYS_HI = ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];
const WEEKDAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const MONTHS_HI = [
  "जनवरी","फ़रवरी","मार्च","अप्रैल","मई","जून",
  "जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर",
];

const MONTHS_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const dateStr = `${isHindi
    ? WEEKDAYS_HI[today.getDay()]
    : WEEKDAYS_EN[today.getDay()]
  }, ${
    isHindi
      ? toHindiNumerals(today.getDate())
      : today.getDate()
  } ${
    isHindi
      ? MONTHS_HI[today.getMonth()]
      : MONTHS_EN[today.getMonth()]
  } ${
    isHindi
      ? toHindiNumerals(today.getFullYear())
      : today.getFullYear()
  }`;

  const [editMode, setEditMode] = useState(false);
  const [familyData, setFamilyData] = useState({
    name: fname + " Sharma",
    gotra: "Kashyap",
    kuldevi: "Mata Vaishno Devi",
    kuldevta: "Lord Ganesha",
    nakshatra: "Rohini",
    greatGrandparents: [
      { name: "Ram Prasad", relation: "Great Grandfather", relationKey: "greatGrandfather", status: "deceased" },
      { name: "Durga Devi", relation: "Great Grandmother", relationKey: "greatGrandmother", status: "deceased" },
    ],
    grandparents: [
      { name: "Shyam Lal", relation: "Paternal Grandfather", relationKey: "paternalGrandfather", status: "deceased" },
      { name: "Kamla Devi", relation: "Paternal Grandmother", relationKey: "paternalGrandmother", status: "deceased" },
      { name: "Mohan Lal", relation: "Maternal Grandfather", relationKey: "maternalGrandfather", status: "deceased" },
      { name: "Savitri Devi", relation: "Maternal Grandmother", relationKey: "maternalGrandmother", status: "alive" },
    ],
    parents: [
      { name: "Ramesh Kumar", relation: "Father", relationKey: "father", status: "alive" },
      { name: "Sunita Sharma", relation: "Mother", relationKey: "mother", status: "alive" },
    ],
    siblings: [
      { name: "Rahul Sharma", relation: "Brother", relationKey: "brother", status: "alive" },
    ],
    spouse: { name: "Anil Verma", relation: "Husband", relationKey: "husband", status: "alive" },
    children: [
      { name: "Aryan Verma", relation: "Son", relationKey: "son", status: "alive" },
    ],
  });

  const [editForm, setEditForm] = useState({ ...familyData });

  const PersonCard = ({ person, highlight = false, size = "normal" }) => {
    const isDeceased = person.status === "deceased";
    const isSmall = size === "small";
    const relationLabel = person.relationKey ? (t[person.relationKey] || person.relation) : person.relation;
    return (
      <div style={{
        minWidth: isSmall ? 76 : 90,
        maxWidth: isSmall ? 100 : 120,
        flex: "1 1 auto",
        padding: isSmall ? "7px 8px" : "10px 10px",
        background: isDeceased
          ? "rgba(120,80,200,0.08)"
          : highlight
            ? "linear-gradient(135deg,rgba(251,191,36,0.2),rgba(251,191,36,0.08))"
            : "rgba(255,255,255,0.05)",
        border: isDeceased
          ? "1px solid rgba(120,80,200,0.25)"
          : highlight
            ? "2px solid rgba(251,191,36,0.5)"
            : "1px solid rgba(45,212,191,0.2)",
        borderRadius: 12,
        textAlign: "center",
        flexShrink: 0,
      }}>
        <div style={{ fontSize: isSmall ? 14 : 18, marginBottom: 3 }}>
          {isDeceased ? "🕊️" : highlight ? "🙏" : "👤"}
        </div>
        <div style={{ fontSize: isSmall ? 9 : 10, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 2 }}>
          {person.name}
        </div>
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{relationLabel}</div>
        {isDeceased && <div style={{ fontSize: 8, color: "#c084fc", marginTop: 2 }}>{t.pitraLoka}</div>}
      </div>
    );
  };

  const GenLabel = ({ label }) => (
    <div style={{ fontSize: 8, letterSpacing: 1, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>
      {label}
    </div>
  );

  const Connector = ({ color = "rgba(255,255,255,0.15)" }) => (
    <div style={{ display: "flex", justifyContent: "center", height: 16 }}>
      <div style={{ width: 2, background: color }} />
    </div>
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .ft-root {
          padding: 20px 16px 40px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Top Row ── */
        .ft-toprow {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 20px; gap: 12px;
        }
        .ft-greeting {
          font-size: 12px; color: #fbbf24; font-weight: 500;
          margin-bottom: 4px; display: flex; align-items: center; gap: 5px;
        }
        .ft-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 3px; line-height: 1.2; }
        .ft-date  { font-size: 12px; color: rgba(255,255,255,0.4); }
        .ft-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        .ft-icon-btn {
          width: 38px; height: 38px; border-radius: 12px;
          background: rgba(255,255,255,0.08); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.6);
        }
        .ft-icon-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }

        .ft-btn {
          display: inline-flex; align-items: center; gap: 5px;
          border-radius: 10px; padding: 7px 12px;
          font-size: 12px; font-weight: 600; cursor: pointer; border: none;
          text-decoration: none; transition: all 0.2s;
        }
        .ft-btn-gold {
          background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.3);
          color: #fcd34d;
        }
        .ft-btn-gold:hover { background: rgba(251,191,36,0.22); }
        .ft-btn-teal {
          background: rgba(45,212,191,0.1); border: 1px solid rgba(45,212,191,0.25);
          color: #2dd4bf;
        }
        .ft-btn-teal:hover { background: rgba(45,212,191,0.18); }
        .ft-btn-purple {
          background: rgba(192,132,252,0.1); border: 1px solid rgba(192,132,252,0.25);
          color: #c084fc;
        }
        .ft-btn-purple:hover { background: rgba(192,132,252,0.18); }

        /* ── Stats Strip — 4 col desktop, 2x2 mobile ── */
        .ft-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px; margin-bottom: 16px;
        }
        .ft-stat-card {
          border-radius: 14px; padding: 14px 10px;
          text-align: center;
        }
        .ft-stat-icon  { font-size: 18px; margin-bottom: 6px; }
        .ft-stat-value { font-size: 20px; font-weight: 700; line-height: 1; margin-bottom: 2px; }
        .ft-stat-label { font-size: 10px; color: rgba(255,255,255,0.4); }

        /* ── Heritage Banner — 4 col desktop, 2x2 mobile ── */
        .ft-heritage {
          background: linear-gradient(135deg,rgba(251,191,36,0.08),rgba(192,132,252,0.06));
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 14px; padding: 12px; margin-bottom: 16px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center;
        }
        .ft-heritage-item {
          padding: 9px 4px; background: rgba(255,255,255,0.04); border-radius: 10px;
        }
        .ft-heritage-emoji { font-size: 18px; margin-bottom: 3px; }
        .ft-heritage-label { font-size: 8px; color: rgba(255,255,255,0.3); }
        .ft-heritage-value { font-size: 10px; font-weight: 700; margin-top: 2px; }

        /* ── Tree Card ── */
        .ft-tree-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 16px 12px; margin-bottom: 14px;
          overflow-x: auto; text-align: center;
        }
        .ft-tree-inner { min-width: 320px; }

        .ft-gen-row {
          display: flex; justify-content: center; gap: 6px;
          flex-wrap: wrap; margin-bottom: 4px;
        }

        /* ── Self node ── */
        .ft-self-node {
          display: inline-block; padding: 12px 18px;
          background: linear-gradient(135deg,rgba(251,191,36,0.18),rgba(251,191,36,0.06));
          border: 2px solid rgba(251,191,36,0.5); border-radius: 14px; min-width: 120px;
        }
        .ft-self-name { font-size: 13px; font-weight: 700; color: #fbbf24; margin: 4px 0 2px; }
        .ft-self-sub  { font-size: 8px; color: rgba(255,255,255,0.35); }
        .ft-self-you  { font-size: 9px; font-weight: 700; color: #fbbf24; margin-top: 3px; }

        /* ── Bottom Actions ── */
        .ft-bottom-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }

        /* ── Edit Modal ── */
        .ft-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: flex-end; justify-content: center;
          z-index: 1000; padding: 0;
        }
        .ft-modal {
          background: #1a1a2e; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px 20px 0 0; padding: 20px 20px 32px;
          width: 100%; max-width: 520px;
          max-height: 85vh; overflow-y: auto;
        }
        .ft-modal-handle {
          width: 36px; height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.2); margin: 0 auto 16px;
        }
        .ft-modal-title { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 16px; }
        .ft-field-label { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
        .ft-field-input {
          width: 100%; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 10px 12px; color: #fff; font-size: 14px; margin-bottom: 12px;
          outline: none;
        }
        .ft-field-input:focus { border-color: rgba(251,191,36,0.4); }
        .ft-modal-actions { display: flex; gap: 8px; margin-top: 4px; }

        /* ── Responsive breakpoints ── */
        @media (max-width: 600px) {
          .ft-root       { padding: 16px 12px 36px; }
          .ft-title      { font-size: 19px; }
          .ft-stats      { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .ft-heritage   { grid-template-columns: repeat(2, 1fr); gap: 6px; }
          .ft-tree-card  { padding: 12px 8px; }
          .ft-bottom-actions { gap: 6px; }
          .ft-btn        { padding: 7px 10px; font-size: 11px; }
        }

        @media (max-width: 380px) {
          .ft-title      { font-size: 17px; }
          .ft-actions .ft-btn span:not(.material-symbols-outlined) { display: none; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ft-root > * { animation: fadeUp 0.7s ease both; }
        .ft-root > *:nth-child(2) { animation-delay: 0.05s; }
        .ft-root > *:nth-child(3) { animation-delay: 0.10s; }
        .ft-root > *:nth-child(4) { animation-delay: 0.15s; }
        .ft-root > *:nth-child(5) { animation-delay: 0.20s; }
      `}</style>

      <div className="ft-root">

        {/* ── Top Row ── */}
        <div className="ft-toprow">
          <div>
            <div className="ft-greeting">
              <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
              🌳 {t.greeting}
            </div>
            <h1 className="ft-title">
              {isHindi ? t.pageTitle : `${familyData.name}'s Family Tree`}
            </h1>
            <div className="ft-date">{dateStr} · {familyData.gotra} {t.gotraLabel}</div>
          </div>
          <div className="ft-actions">
            <button className="ft-icon-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
            </button>
            <button className="ft-btn ft-btn-gold" onClick={() => { setEditForm({ ...familyData }); setEditMode(true); }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
              <span>{t.edit}</span>
            </button>
          </div>
        </div>

        {/* ── Heritage Banner ── */}
        <div className="ft-heritage">
          {[
            { emoji: "🙏", label: t.kuldevi,    value: familyData.kuldevi,    color: "#fbbf24" },
            { emoji: "🕉️", label: t.kuldevta,   value: familyData.kuldevta,   color: "#c084fc" },
            { emoji: "🌿", label: t.gotra,       value: familyData.gotra,      color: "#2dd4bf" },
            { emoji: "⭐", label: t.nakshatra,   value: familyData.nakshatra,  color: "#60a5fa" },
          ].map(h => (
            <div key={h.label} className="ft-heritage-item">
              <div className="ft-heritage-emoji">{h.emoji}</div>
              <div className="ft-heritage-label">{h.label}</div>
              <div className="ft-heritage-value" style={{ color: h.color }}>{h.value}</div>
            </div>
          ))}
        </div>

        {/* ── Family Tree Visual ── */}
        <div className="ft-tree-card">
          <div className="ft-tree-inner">

            {/* Great Grandparents */}
            <GenLabel label={t.genIII} />
            <div className="ft-gen-row">
              {familyData.greatGrandparents.map((p, i) => (
                <PersonCard key={i} person={p} size="small" />
              ))}
            </div>

            <Connector />

            {/* Grandparents */}
            <GenLabel label={t.genII} />
            <div className="ft-gen-row">
              {familyData.grandparents.map((p, i) => (
                <PersonCard key={i} person={p} size="small" />
              ))}
            </div>

            <Connector />

            {/* Parents */}
            <GenLabel label={t.genI} />
            <div className="ft-gen-row">
              {familyData.parents.map((p, i) => (
                <PersonCard key={i} person={p} />
              ))}
            </div>

            <Connector color="rgba(251,191,36,0.5)" />

            {/* Self + Siblings + Spouse */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              {familyData.siblings.map((s, i) => (
                <PersonCard key={i} person={s} size="small" />
              ))}
              <div className="ft-self-node">
                <div style={{ fontSize: 24 }}>🙏</div>
                <div className="ft-self-name">{familyData.name}</div>
                <div className="ft-self-sub">{familyData.nakshatra} · {familyData.gotra}</div>
                <div className="ft-self-you">{t.you}</div>
              </div>
              {familyData.spouse && (
                <PersonCard person={familyData.spouse} />
              )}
            </div>

            {familyData.children.length > 0 && (
              <>
                <Connector color="rgba(45,212,191,0.4)" />
                <GenLabel label={t.nextGen} />
                <div className="ft-gen-row">
                  {familyData.children.map((c, i) => (
                    <PersonCard key={i} person={c} />
                  ))}
                </div>
              </>
            )}

          </div>
        </div>

        {/* ── Bottom Actions ── */}
        <div className="ft-bottom-actions">
          <button className="ft-btn ft-btn-teal" onClick={() => {
            const newMember = { name: "New Member", relation: "Add Relation", relationKey: "addRelation", status: "alive" };
            setFamilyData(f => ({ ...f, children: [...f.children, newMember] }));
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add_circle</span>
            {t.addMember}
          </button>
          <button className="ft-btn ft-btn-purple">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>list_alt</span>
            {t.pitraLog}
          </button>
          <button className="ft-btn ft-btn-gold">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>share</span>
            {t.shareTree}
          </button>
        </div>

      </div>

      {/* ── Edit Modal (bottom sheet on mobile) ── */}
      {editMode && (
        <div className="ft-modal-overlay" onClick={() => setEditMode(false)}>
          <div className="ft-modal" onClick={e => e.stopPropagation()}>
            <div className="ft-modal-handle" />
            <div className="ft-modal-title">{t.editTitle}</div>

            {[
              { key: "name",      label: t.fullName   },
              { key: "gotra",     label: t.gotra      },
              { key: "kuldevi",   label: t.kuldevi    },
              { key: "kuldevta",  label: t.kuldevta   },
              { key: "nakshatra", label: t.nakshatra  },
            ].map(f => (
              <div key={f.key}>
                <div className="ft-field-label">{f.label}</div>
                <input
                  className="ft-field-input"
                  value={editForm[f.key] || ""}
                  onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}

            <div className="ft-modal-actions">
              <button
                className="ft-btn ft-btn-gold"
                style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                onClick={() => { setFamilyData({ ...editForm }); setEditMode(false); }}
              >
                {t.saveChanges}
              </button>
              <button
                className="ft-btn"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "12px 16px" }}
                onClick={() => setEditMode(false)}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FamilyTree;