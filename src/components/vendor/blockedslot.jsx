'use client';

import React, { useEffect, useState, useRef } from "react";
import Apiconnect from '@/services/Apiconnect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const BlockedSlot = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const t = {
    pageTitle:        isHindi ? "अवरुद्ध स्लॉट"                        : "Blocked Slots",
    blockBtn:         isHindi ? "स्लॉट ब्लॉक करें"                      : "Block Slot",
    blocking:         isHindi ? "ब्लॉक हो रहा है..."                    : "Blocking...",
    fromDateTime:     isHindi ? "प्रारंभ दिनांक और समय"                 : "From Date & Time",
    toDateTime:       isHindi ? "समाप्ति दिनांक और समय"                 : "To Date & Time",
    reason:           isHindi ? "कारण"                                   : "Reason",
    reasonPlaceholder:isHindi ? "कारण दर्ज करें"                        : "Enter reason",
    blockedList:      isHindi ? "अवरुद्ध तारीखों की सूची"               : "Blocked Date List",
    loading:          isHindi ? "लोड हो रहा है..."                       : "Loading...",
    noSlots:          isHindi ? "कोई अवरुद्ध स्लॉट नहीं जोड़े गए"       : "No blocked slots added",
    from:             isHindi ? "से:"                                    : "From:",
    to:               isHindi ? "तक:"                                    : "To:",
    reasonLabel:      isHindi ? "कारण:"                                  : "Reason:",
    remove:           isHindi ? "हटाएं"                                  : "Remove",

    // alerts
    selectBoth:       isHindi ? "कृपया प्रारंभ और समाप्ति दिनांक व समय चुनें" : "Please select both From and To date & time",
    toAfterFrom:      isHindi ? "समाप्ति दिनांक और समय, प्रारंभ के बाद होना चाहिए" : "To date & time must be after From date & time",
    overlapErr:       isHindi ? "यह स्लॉट किसी मौजूदा अवरुद्ध स्लॉट से टकराता है" : "This slot overlaps with an existing blocked slot",
    confirmDelete:    isHindi ? "क्या आप वाकई इस अवरुद्ध स्लॉट को हटाना चाहते हैं?" : "Are you sure you want to delete this blocked slot?",
    apiError:         isHindi ? "API त्रुटि"                             : "API Error",
    deleteApiError:   isHindi ? "हटाने में API त्रुटि"                   : "Delete API Error",

    // toasts
    blockSuccess:     isHindi ? "स्लॉट सफलतापूर्वक ब्लॉक किया गया"      : "Block added successfully",
    blockFailed:      isHindi ? "कुछ गलत हुआ"                           : "Something went wrong",
    deleteSuccess:    isHindi ? "सफलतापूर्वक हटाया गया"                  : "Deleted successfully",
    deleteFailed:     isHindi ? "हटाना विफल"                             : "Delete failed",
  };

  const [vendorId, setVendorId] = useState(null);
  const [formData, setFormData] = useState({
    fromDateTime: "",
    toDateTime: "",
    reason: "",
  });

  const [blockedList, setBlockedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    fetchVendorInfo();
  }, []);

  // FETCH VENDOR INFO
  const fetchVendorInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await Apiconnect.postData(
        "/vendor/vendorinfo",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Vendor Info Response", response);

      if (response.data.status === 1) {
        const vendorData = response.data.vendor;

        console.log("Vendor Data", vendorData);

        setVendorId(vendorData.id);

        fetchBlockedList(vendorData.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH BLOCK LIST
  const fetchBlockedList = async (id) => {
    try {
      setListLoading(true);

      const response = await Apiconnect.postData("/vendor_block_list", {
        vendor_id: id,
      });

      console.log("block list", response);

      if (String(response.data.status) === "1") {
        setBlockedList(response.data.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setListLoading(false);
    }
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // FORMAT DATE TIME
  const formatDateTime = (date, time) => {
    if (!date || !time) return "";

    const fullDate = new Date(`${date}T${time}`);

    return fullDate.toLocaleString(isHindi ? "hi-IN" : "en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00";

    return `${hours}:${minutes}:${seconds}`;
  };

  // ADD BLOCK
  const handleAddBlock = async () => {
    const { fromDateTime, toDateTime, reason } = formData;

    if (!fromDateTime || !toDateTime) {
      alert(t.selectBoth);
      return;
    }

    const fromDate = new Date(fromDateTime);
    const toDate = new Date(toDateTime);

    if (toDate <= fromDate) {
      alert(t.toAfterFrom);
      return;
    }

    // OVERLAP CHECK
    const hasOverlap = blockedList.some((block) => {
      const existingFrom = new Date(`${block.block_date}T${block.start_time}`);

      const existingTo = new Date(`${block.end_block_date}T${block.end_time}`);

      return (
        (fromDate >= existingFrom && fromDate <= existingTo) ||
        (toDate >= existingFrom && toDate <= existingTo) ||
        (fromDate <= existingFrom && toDate >= existingTo)
      );
    });

    if (hasOverlap) {
      alert(t.overlapErr);
      return;
    }

    const payload = {
      vendor_id: vendorId,
      block_date: formatDate(fromDateTime),
      start_time: formatTime(fromDateTime),
      end_time: formatTime(toDateTime),
      end_block_date: formatDate(toDateTime),
      reason: reason || "Blocked Slot",
      status: 1,
    };

    try {
      setLoading(true);

      const response = await Apiconnect.postData(
        "create_vendor_block",
        payload,
      );
console.log(response)
      if (response.data.status === 1) {
        toast.success(response.data.message || t.blockSuccess);

        setFormData({
          fromDateTime: "",
          toDateTime: "",
          reason: "",
        });

        fetchBlockedList(vendorId);
      } else {
        toast.error(response.data.message || t.blockFailed);
      }
    } catch (error) {
      console.log(error);
      alert(
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  t.apiError
);
    } finally {
      setLoading(false);
    }
  };

  // REMOVE FROM UI
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t.confirmDelete);

    if (!confirmDelete) return;
    try {
      const response = await Apiconnect.deleteData(`delete_vendor_block/${id}`);
      console.log("Delete Response", response);

      if (response.data.status === 1 || response.data.status === "1") {
        toast.success(response.data.message || t.deleteSuccess);

        setBlockedList((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(response.data.message || t.deleteFailed);
      }
    } catch (error) {
      console.log(error);
      alert(t.deleteApiError);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.heading}>{t.pageTitle}</h2>

          <button
            style={styles.button}
            onClick={handleAddBlock}
            disabled={loading}
          >
            {loading ? t.blocking : t.blockBtn}
          </button>
        </div>

        {/* FORM */}
        <div style={styles.formContainer}>
          {/* FROM */}
          <div
            style={styles.inputGroup}
            onClick={() => fromRef.current?.showPicker()}
          >
            <label style={styles.label}>{t.fromDateTime}</label>

            <input
              ref={fromRef}
              type="datetime-local"
              name="fromDateTime"
              value={formData.fromDateTime}
              onChange={handleChange}
              style={styles.input}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* TO */}
          <div
            style={styles.inputGroup}
            onClick={() => toRef.current?.showPicker()}
          >
            <label style={styles.label}>{t.toDateTime}</label>

            <input
              ref={toRef}
              type="datetime-local"
              name="toDateTime"
              value={formData.toDateTime}
              onChange={handleChange}
              style={styles.input}
              min={
                formData.fromDateTime || new Date().toISOString().slice(0, 16)
              }
            />
          </div>

          {/* REASON */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t.reason}</label>

            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder={t.reasonPlaceholder}
              style={styles.input}
            />
          </div>
        </div>

        {/* LIST */}
        <div style={styles.listContainer}>
          <h3 style={styles.subHeading}>{t.blockedList}</h3>

          {listLoading ? (
            <div style={styles.empty}>{t.loading}</div>
          ) : blockedList.length === 0 ? (
            <div style={styles.empty}>{t.noSlots}</div>
          ) : (
            blockedList.map((item) => (
              <div key={item.id} style={styles.listItem}>
                <div style={styles.dateText}>
                  <strong>{t.from}</strong>{" "}
                  {formatDateTime(item.block_date, item.start_time)}
                  <span style={{ margin: "0 10px" }}>→</span>
                  <strong>{t.to}</strong>{" "}
                  {formatDateTime(item.end_block_date, item.end_time)}
                  {item.reason && (
                    <div style={{ marginTop: "5px" }}>
                      <strong>{t.reasonLabel}</strong> {item.reason}
                    </div>
                  )}
                </div>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(item.id)}
                >
                  {t.remove}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
  },

  card: {
    borderRadius: "12px",
    padding: "5px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(135deg, #461572, #501D69, #2A104B)",
    
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "10px",
  },

  heading: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#fff",
    margin: 0,
  },

  formContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },

  inputGroup: {
    flex: 1,
    minWidth: "280px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#d1d5db",
    fontSize: "14px",
    fontWeight: "500",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #4b5563",
    background: "#1f2937",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  listContainer: {
    marginTop: "10px",
  },

  subHeading: {
    marginBottom: "15px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
  },

  empty: {
    padding: "18px",
    borderRadius: "8px",
    textAlign: "center",
    background: "#374151",
    color: "#d1d5db",
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#111827",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "10px",
  },

  dateText: {
    color: "#fff",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default BlockedSlot;