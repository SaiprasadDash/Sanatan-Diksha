'use client';

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";

/* ── SVG Icons ── */
const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const IconDelete = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const IconUpload = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

const IconLoader = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const emptyForm = {
  media_typ: "image",
  media_link: "",
};

const Gallery = () => {
  const { t, i18n } = useTranslation();

  const isHindi = i18n.language === "hi";

  const text = {
    title: isHindi ? "गैलरी सूची" : "Gallery Listing",
    addImage: isHindi ? "इमेज जोड़ें" : "Add Image",
    loadingGallery: isHindi ? "गैलरी लोड हो रही है..." : "Loading gallery...",
    noImages: isHindi ? "कोई इमेज नहीं मिली" : "No images found",
    delete: isHindi ? "डिलीट" : "Delete",
    edit: isHindi ? "एडिट" : "Edit",
    loading: isHindi ? "लोड हो रहा है" : "Loading",
    editImage: isHindi ? "इमेज एडिट करें" : "Edit Image",
    addImageModal: isHindi ? "इमेज जोड़ें" : "Add Image",
    uploadImage: isHindi ? "इमेज अपलोड करने के लिए क्लिक करें" : "Click to upload image",
    uploading: isHindi ? "अपलोड हो रहा है..." : "Uploading...",
    cancel: isHindi ? "रद्द करें" : "Cancel",
    saving: isHindi ? "सेव हो रहा है..." : "Saving...",
    update: isHindi ? "अपडेट" : "Update",
    save: isHindi ? "सेव" : "Save",
    failedFetchGallery: isHindi ? "गैलरी प्राप्त करने में विफल" : "Failed to fetch gallery",
    apiError: isHindi ? "API त्रुटि" : "API error",
    failedFetchMedia: isHindi ? "मीडिया प्राप्त करने में विफल" : "Failed to fetch media",
    failedFetchMediaDetails: isHindi ? "मीडिया विवरण प्राप्त करने में विफल" : "Failed to fetch media details",
    pleaseSelectImage: isHindi ? "कृपया इमेज चुनें" : "Please select image",
    uploadFailed: isHindi ? "अपलोड विफल" : "Upload failed",
    imageUploaded: isHindi ? "इमेज अपलोड हो गई!" : "Image uploaded!",
    pleaseUploadImage: isHindi ? "कृपया इमेज अपलोड करें" : "Please upload image",
    galleryUpdated: isHindi ? "गैलरी अपडेट हो गई!" : "Gallery updated!",
    galleryCreated: isHindi ? "गैलरी बनाई गई!" : "Gallery created!",
    operationFailed: isHindi ? "ऑपरेशन विफल" : "Operation failed",
    deleteConfirm: isHindi ? "क्या आप इस इमेज को डिलीट करना चाहते हैं?" : "Delete this image?",
    imageDeleted: isHindi ? "इमेज डिलीट हो गई" : "Image deleted",
    deleteFailed: isHindi ? "डिलीट विफल" : "Delete failed",
  };

  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingEdit, setIsFetchingEdit] = useState(null);

  const fileRef = useRef();

  /* ── FETCH LIST ── */
  const fetchGalleryList = async () => {
    try {
      setLoading(true);

      const res = await Apiconnect.postData("vendor/media/list");

      if (res.data?.status === 1) {
        const imageOnly = (res.data.data || []).filter(
          (item) => item.media_typ === "image"
        );

        setGalleryList(imageOnly);
      } else {
        toast.error(res.data?.message || text.failedFetchGallery);
      }
    } catch {
      toast.error(text.apiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryList();
  }, []);

  /* ── OPEN ADD ── */
  const openAdd = () => {
    setModalMode("add");
    setEditId(null);
    setForm(emptyForm);
    setPreviewUrl("");

    if (fileRef.current) fileRef.current.value = "";

    setShowModal(true);
  };

  /* ── OPEN EDIT ── */
  const openEdit = async (id) => {
    try {
      setIsFetchingEdit(id);

      const res = await Apiconnect.postData(`vendor/media/list/${id}`);

      const d = res.data?.data;

      if (!d) {
        toast.error(text.failedFetchMedia);
        return;
      }

      setModalMode("edit");
      setEditId(d.id);

      setForm({
        media_typ: "image",
        media_link: d.media_link || "",
      });

      setPreviewUrl(d.media_link || "");

      if (fileRef.current) fileRef.current.value = "";

      setShowModal(true);

    } catch {
      toast.error(text.failedFetchMediaDetails);
    } finally {
      setIsFetchingEdit(null);
    }
  };

  /* ── FILE UPLOAD ── */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(text.pleaseSelectImage);
      return;
    }

    try {
      setIsUploading(true);

      const fd = new FormData();

      fd.append("files", file, file.name);
      fd.append("folder", "media");
      fd.append("text", "media");

      const res = await Apiconnect.postData("upload", fd);

      if (res.data?.success) {
        const url = res.data?.files?.[0]?.url || "";

        setForm((f) => ({
          ...f,
          media_link: url,
        }));

        setPreviewUrl(url);

        toast.success(text.imageUploaded);
      } else {
        toast.error(res.data?.message || text.uploadFailed);
      }

    } catch {
      toast.error(text.uploadFailed);
    } finally {
      setIsUploading(false);

      if (fileRef.current) fileRef.current.value = "";
    }
  };

  /* ── SAVE ── */
  const handleSave = async () => {
    if (!form.media_link) {
      toast.error(text.pleaseUploadImage);
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        media_typ: "image",
        media_link: form.media_link,
      };

      const endpoint =
        modalMode === "edit"
          ? `vendor/media/update/${editId}`
          : "vendor/media/create";

      const res = await Apiconnect.postData(endpoint, payload);

      if (res.data?.status === 1 || res.data?.status === "1") {
        toast.success(
          modalMode === "edit"
            ? text.galleryUpdated
            : text.galleryCreated
        );

        setShowModal(false);

        fetchGalleryList();
      } else {
        toast.error(res.data?.message || text.operationFailed);
      }

    } catch {
      toast.error(text.operationFailed);
    } finally {
      setIsSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    if (!window.confirm(text.deleteConfirm)) return;

    try {
      const res = await Apiconnect.deleteData(
        `vendor/media/delete/${id}`
      );

      if (res.data?.status === 1) {
        toast.success(text.imageDeleted);

        fetchGalleryList();
      } else {
        toast.error(res.data?.message || text.deleteFailed);
      }

    } catch {
      toast.error(text.deleteFailed);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPreviewUrl("");

    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
        }

        .gallery-page{
          max-width:1400px;
          margin:0 auto;
          padding:24px 16px;
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          color:#fff;
        }

        .gallery-header{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:22px;
        }

        .gallery-title{
          font-size:22px;
          font-weight:700;
        }

        .gallery-add-btn{
          height:38px;
          padding:0 16px;
          border:none;
          border-radius:10px;
          background:#f59e0b;
          color:#111827;
          font-size:13px;
          font-weight:700;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:6px;
        }

        .gallery-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:18px;
        }

        .gallery-card{
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:16px;
          overflow:hidden;
        }

        .gallery-img{
          width:100%;
          height:230px;
          object-fit:cover;
          display:block;
        }

        .gallery-actions{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:12px;
        }

        .gallery-btn{
          height:32px;
          padding:0 12px;
          border:none;
          border-radius:8px;
          font-size:12px;
          font-weight:600;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:5px;
          background:rgba(255,255,255,0.06);
        }

        .gallery-btn.edit{
          color:#fbbf24;
        }

        .gallery-btn.delete{
          color:#f87171;
        }

        .gallery-empty{
          text-align:center;
          padding:70px 0;
          color:rgba(255,255,255,0.35);
        }

        .gallery-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.7);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
          padding:16px;
        }

        .gallery-modal{
          width:100%;
          max-width:450px;
          background:#0f172a;
          border-radius:18px;
          border:1px solid rgba(255,255,255,0.08);
          padding:22px;
        }

        .gallery-modal-head{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:18px;
        }

        .gallery-modal-title{
          font-size:18px;
          font-weight:700;
        }

        .gallery-close{
          width:30px;
          height:30px;
          border:none;
          border-radius:8px;
          background:rgba(255,255,255,0.08);
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
        }

        .gallery-upload{
          width:100%;
          height:240px;
          border-radius:14px;
          border:2px dashed rgba(255,255,255,0.12);
          background:rgba(255,255,255,0.03);
          overflow:hidden;
          position:relative;
        }

        .gallery-upload input{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          opacity:0;
          cursor:pointer;
          z-index:2;
        }

        .gallery-placeholder{
          width:100%;
          height:100%;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:10px;
          color:rgba(255,255,255,0.35);
          font-size:13px;
        }

        .gallery-preview{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .gallery-footer{
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:18px;
        }

        .gallery-cancel{
          height:38px;
          padding:0 18px;
          border:none;
          border-radius:10px;
          background:rgba(255,255,255,0.08);
          color:#fff;
          cursor:pointer;
        }

        .gallery-save{
          height:38px;
          padding:0 18px;
          border:none;
          border-radius:10px;
          background:#f59e0b;
          color:#111827;
          font-weight:700;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:6px;
        }

        .spin{
          animation:spin .8s linear infinite;
        }

        @keyframes spin{
          to{
            transform:rotate(360deg);
          }
        }

        @media(max-width:1100px){
          .gallery-grid{
            grid-template-columns:repeat(3,1fr);
          }
        }

        @media(max-width:768px){
          .gallery-grid{
            grid-template-columns:repeat(2,1fr);
          }
        }

        @media(max-width:520px){
          .gallery-grid{
            grid-template-columns:1fr;
          }
        }
      `}</style>

      <div className="gallery-page">

        <div className="gallery-header">
          <h2 className="gallery-title">{text.title}</h2>

          <button
            className="gallery-add-btn"
            onClick={openAdd}
          >
            <IconPlus />
            {text.addImage}
          </button>
        </div>

        {loading ? (
          <div className="gallery-empty">
            {text.loadingGallery}
          </div>
        ) : galleryList.length === 0 ? (
          <div className="gallery-empty">
            {text.noImages}
          </div>
        ) : (
          <div className="gallery-grid">

            {galleryList.map((item) => (
              <div className="gallery-card" key={item.id}>

                <img
                  src={item.media_link}
                  alt="gallery"
                  className="gallery-img"
                />

                <div className="gallery-actions">

                  <button
                    className="gallery-btn delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <IconDelete />
                    {text.delete}
                  </button>

                  <button
                    className="gallery-btn edit"
                    onClick={() => openEdit(item.id)}
                    disabled={isFetchingEdit === item.id}
                  >
                    {isFetchingEdit === item.id ? (
                      <>
                        <span className="spin">
                          <IconLoader />
                        </span>
                        {text.loading}
                      </>
                    ) : (
                      <>
                        <IconEdit />
                        {text.edit}
                      </>
                    )}
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      {showModal && (
        <div className="gallery-overlay">

          <div className="gallery-modal">

            <div className="gallery-modal-head">
              <div className="gallery-modal-title">
                {modalMode === "edit"
                  ? text.editImage
                  : text.addImageModal}
              </div>

              <button
                className="gallery-close"
                onClick={closeModal}
              >
                <IconX />
              </button>
            </div>

            <div className="gallery-upload">

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="gallery-preview"
                />
              ) : (
                <div className="gallery-placeholder">
                  <IconUpload />
                  <span>{text.uploadImage}</span>
                </div>
              )}

              {isUploading && (
                <div
                  style={{
                    position:"absolute",
                    inset:0,
                    background:"rgba(0,0,0,0.7)",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    gap:"8px",
                    color:"#fff",
                    fontSize:"13px",
                    fontWeight:"600",
                    zIndex:5
                  }}
                >
                  <span className="spin">
                    <IconLoader />
                  </span>
                  {text.uploading}
                </div>
              )}

            </div>

            <div className="gallery-footer">

              <button
                className="gallery-cancel"
                onClick={closeModal}
              >
                {text.cancel}
              </button>

              <button
                className="gallery-save"
                onClick={handleSave}
                disabled={isSaving || isUploading}
              >
                {isSaving ? (
                  <>
                    <span className="spin">
                      <IconLoader />
                    </span>
                    {text.saving}
                  </>
                ) : (
                  modalMode === "edit"
                    ? text.update
                    : text.save
                )}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Gallery;