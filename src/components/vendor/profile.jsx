'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import Apiconnect from '@/services/Apiconnect";
import { toast } from "react-toastify";
import Helper from '@/services/HelperCodebase";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

/* ── ID Proof types ── */
const ID_PROOF_TYPES = [
  { value: "AdharCard", label_en: "Aadhar Card", label_hi: "आधार कार्ड", icon: "badge" },
  { value: "PanCard", label_en: "PAN Card", label_hi: "पैन कार्ड", icon: "credit_card" },
  { value: "DrivingLicense", label_en: "Driving Licence", label_hi: "ड्राइविंग लाइसेंस", icon: "drive_eta" },
  { value: "Passport", label_en: "Passport", label_hi: "पासपोर्ट", icon: "book" },
  { value: "VoterID", label_en: "Voter ID", label_hi: "वोटर आईडी", icon: "how_to_vote" },
];

/* ── crop helpers ── */
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

async function getCroppedBlob(imageSrc, pixelCrop) {
  const img = new Image();
  img.src = imageSrc;
  await new Promise((res) => {
    img.onload = res;
  });
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    img,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );
  return new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
}

const ProfileManagement = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  /* ── i18n text map ── */
  const t = {
    pageTitle:          isHindi ? "प्रोफ़ाइल प्रबंधन"        : "Profile Management",
    loading:            isHindi ? "प्रोफ़ाइल लोड हो रही है..." : "Loading profile...",
    edit:               isHindi ? "संपादित करें"              : "Edit",
    save:               isHindi ? "सहेजें"                    : "Save",
    saving:             isHindi ? "सहेजा जा रहा है..."        : "Saving...",
    fullName:           isHindi ? "पूरा नाम"                  : "Full Name",
    specialty:          isHindi ? "विशेषता"                   : "Specialty",
    location:           isHindi ? "स्थान"                     : "Location",
    searchAddress:      isHindi ? "पता खोजें"                 : "Search address",
    languages:          isHindi ? "भाषाएँ"                    : "Languages",
    addLanguage:        isHindi ? "+ भाषा जोड़ें"              : "+ Add Language",
    temples:            isHindi ? "मंदिर"                     : "Temples",
    addTemple:          isHindi ? "+ मंदिर जोड़ें"             : "+ Add Temple",
    phone:              isHindi ? "फ़ोन"                      : "Phone",
    bankDetails:        isHindi ? "बैंक विवरण"                : "Bank Details",
    acctHolder:         isHindi ? "खाताधारक का नाम"           : "Account Holder Name",
    acctNumber:         isHindi ? "खाता संख्या"               : "Account Number",
    ifsc:               isHindi ? "IFSC कोड"                  : "IFSC Code",
    branch:             isHindi ? "शाखा का नाम"               : "Branch Name",
    yearsExp:           isHindi ? "वर्ष अनुभव"                : "Years Exp.",
    reviews:            isHindi ? "समीक्षाएँ"                 : "reviews",

    /* hold section */
    accountOnHold:      isHindi ? "खाता होल्ड पर है"          : "Account On Hold",
    holdSubtitle:       isHindi ? "जारी रखने के लिए आवश्यक दस्तावेज़ पुनः जमा करें" : "Please resubmit the required documents to continue",
    reasonFromAdmin:    isHindi ? "व्यवस्थापक का कारण"        : "Reason from Admin",
    resubmitDocs:       isHindi ? "दस्तावेज़ पुनः जमा करें"   : "Resubmit Documents",
    idProofType:        isHindi ? "पहचान प्रमाण प्रकार *"     : "ID Proof Type *",
    selectIdType:       isHindi ? "पहचान प्रमाण प्रकार चुनें" : "Select ID Proof Type",
    idProofImage:       isHindi ? "पहचान प्रमाण छवि *"        : "ID Proof Image *",
    uploadedSuccessfully: isHindi ? "सफलतापूर्वक अपलोड हुआ"  : "Uploaded successfully",
    clickToChange:      isHindi ? "बदलने के लिए क्लिक करें"   : "Click to change",
    clickToUploadId:    isHindi ? "पहचान प्रमाण छवि अपलोड करने के लिए क्लिक करें" : "Click to upload ID proof image",
    paymentDetails:     isHindi ? "भुगतान विवरण"              : "Payment Details",
    transactionId:      isHindi ? "लेनदेन आईडी *"             : "Transaction ID *",
    enterTransactionId: isHindi ? "लेनदेन आईडी दर्ज करें"     : "Enter Transaction ID",
    paymentProofImage:  isHindi ? "भुगतान प्रमाण छवि *"       : "Payment Proof Image *",
    imageReady:         isHindi ? "छवि तैयार है"               : "Image ready",
    uploadPaymentProof: isHindi ? "भुगतान प्रमाण अपलोड करने के लिए क्लिक करें" : "Click to upload payment proof",
    resubmitBtn:        isHindi ? "अनुमोदन के लिए पुनः जमा करें" : "Resubmit for Approval",
    submitting:         isHindi ? "जमा किया जा रहा है..."      : "Submitting...",

    /* crop modals */
    cropProfile:        isHindi ? "प्रोफ़ाइल चित्र क्रॉप करें" : "Crop Profile Picture",
    cropIdProof:        isHindi ? "पहचान प्रमाण छवि क्रॉप करें" : "Crop ID Proof Image",
    cropPayment:        isHindi ? "भुगतान प्रमाण क्रॉप करें"   : "Crop Payment Proof",
    dragToAdjust:       isHindi ? "क्रॉप क्षेत्र समायोजित करें" : "Drag to adjust the crop area",
    dragToCropId:       isHindi ? "क्रॉप करें — आईडी स्पष्ट दिखाएं" : "Drag to crop — adjust to show your ID clearly",
    dragToSelect:       isHindi ? "क्रॉप क्षेत्र चुनें"         : "Drag to select crop area",
    cancel:             isHindi ? "रद्द करें"                   : "Cancel",
    cropAndUpload:      isHindi ? "क्रॉप करें और अपलोड करें"   : "Crop & Upload",
    cropAndSave:        isHindi ? "क्रॉप करें और सहेजें"        : "Crop & Save",
    uploading:          isHindi ? "अपलोड हो रहा है…"            : "Uploading…",

    /* toasts */
    templesFailed:      isHindi ? "मंदिर लोड नहीं हुए"          : "Failed to load temples",
    langFailed:         isHindi ? "भाषाएँ लोड नहीं हुईं"        : "Failed to load languages",
    profileFailed:      isHindi ? "प्रोफ़ाइल लोड नहीं हुई"      : "Failed to load profile",
    apiError:           isHindi ? "API त्रुटि"                   : "API error",
    profileUpdated:     isHindi ? "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई" : "Profile updated successfully",
    profileUpdateFailed: isHindi ? "प्रोफ़ाइल अपडेट विफल"       : "Profile update failed",
    templeUpdateFailed: isHindi ? "मंदिर अपडेट विफल"            : "Temple update failed",
    updateFailed:       isHindi ? "अपडेट विफल"                  : "Update failed",
    selectCropArea:     isHindi ? "कृपया क्रॉप क्षेत्र चुनें"   : "Please select a crop area",
    selectIdFirst:      isHindi ? "पहले पहचान प्रमाण प्रकार चुनें" : "Please select ID proof type first",
    profImgUploaded:    isHindi ? "प्रोफ़ाइल छवि अपलोड हुई!"     : "Profile image uploaded!",
    uploadFailed:       isHindi ? "अपलोड विफल"                  : "Upload failed",
    idUploaded:         isHindi ? "पहचान प्रमाण अपलोड हुआ!"     : "ID proof uploaded!",
    imageReady2:        isHindi ? "छवि तैयार है"                 : "Image ready",
    resubmitSuccess:    isHindi ? "पुनः जमा सफल! अनुमोदन की प्रतीक्षा है।" : "Resubmitted successfully! Awaiting approval.",
    resubmitFailed:     isHindi ? "पुनः जमा विफल"               : "Resubmit failed",
    somethingWrong:     isHindi ? "कुछ गलत हुआ। पुनः प्रयास करें।" : "Something went wrong. Please try again.",
    payImgUploadFailed: isHindi ? "भुगतान छवि अपलोड विफल"       : "Payment image upload failed",
    payImgInvalid:      isHindi ? "भुगतान छवि अपलोड प्रतिक्रिया अमान्य" : "Payment image upload response invalid",
    noRituals:          isHindi ? "कोई अनुष्ठान नहीं"            : "No rituals",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [templeList, setTempleList] = useState([]);
  const [selectedTempleIds, setSelectedTempleIds] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [selectedLangIds, setSelectedLangIds] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [bankOpen, setBankOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  /* ── profile picture state ── */
  const [thumbUrl, setThumbUrl] = useState("");
  const [profRawSrc, setProfRawSrc] = useState(null);
  const [profCrop, setProfCrop] = useState();
  const [profCompletedCrop, setProfCompletedCrop] = useState(null);
  const [showProfCropModal, setShowProfCropModal] = useState(false);
  const [isProfUploading, setIsProfUploading] = useState(false);
  const profImgRef = useRef(null);
  const profFileInput = useRef(null);

  const [bankDetails, setBankDetails] = useState({
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    branch_name: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    location: "",
    languages: "",
    phone: "",
    experience: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ── hold section state ── */
  const [holdInfo, setHoldInfo] = useState("");

  /* ── ID Proof re-upload state ── */
  const [idProofTyp, setIdProofTyp] = useState("");
  const [showIdTypeDropdown, setShowIdTypeDropdown] = useState(false);
  const [idRawSrc, setIdRawSrc] = useState(null);
  const [idCrop, setIdCrop] = useState();
  const [idCompletedCrop, setIdCompletedCrop] = useState(null);
  const [idCroppedPreview, setIdCroppedPreview] = useState(null);
  const [showIdCropModal, setShowIdCropModal] = useState(false);
  const [idUploadedUrl, setIdUploadedUrl] = useState("");
  const [idUploadedOk, setIdUploadedOk] = useState(false);
  const [isIdUploading, setIsIdUploading] = useState(false);
  const idImgRef = useRef(null);
  const idFileInput = useRef(null);

  /* ── Payment re-upload state ── */
  const [transactionId, setTransactionId] = useState("");
  const [payRawSrc, setPayRawSrc] = useState(null);
  const [payCrop, setPayCrop] = useState();
  const [payCompletedCrop, setPayCompletedCrop] = useState(null);
  const [payFile, setPayFile] = useState(null);
  const [showPayCropModal, setShowPayCropModal] = useState(false);
  const [isPayUploading, setIsPayUploading] = useState(false);
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);
  const payImgRef = useRef(null);
  const payFileInput = useRef(null);

  const onLoadAutocomplete = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      setFormData((prev) => ({
        ...prev,
        location: place.formatted_address || "",
        latitude: lat || "",
        longitude: lng || "",
      }));
    }
  };

  const fetchTemples = async () => {
    try {
      const res = await Apiconnect.postData("templelist");
      if (res.data?.data) setTempleList(res.data.data);
    } catch {
      toast.error(t.templesFailed);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await Apiconnect.postData("admin_languagelist");
      if (res.data?.data) setLanguageList(res.data.data);
    } catch {
      toast.error(t.langFailed);
    }
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await Apiconnect.postData("vendor/vendorinfo");
      if (res.data?.status === 1) {
        const data = res.data;
        const vendor = data.vendor || {};
        const rituals = data.rituals || [];
        const languages = data.languages || [];
        const temples = data.temples || [];

        setVendorData(vendor);
        setThumbUrl(vendor.thumb || "");

        let parsedBank = {
          account_holder_name: "",
          account_number: "",
          ifsc_code: "",
          branch_name: "",
        };
        try {
          parsedBank =
            typeof vendor.bank_details === "string"
              ? JSON.parse(vendor.bank_details || "{}")
              : vendor.bank_details || parsedBank;
        } catch {}

        setBankDetails(parsedBank);
        setAvgRating(res.data.avg_rating ?? 0);
        setTotalReviews(res.data.total_reviews ?? 0);
        setSelectedTempleIds(temples.map((t) => t.id));
        setSelectedLangIds(languages.map((l) => l.id));

        if (vendor.id_proof_typ) setIdProofTyp(vendor.id_proof_typ);

        if (vendor.is_approved === 4 && vendor.hold_info) {
          setHoldInfo(vendor.hold_info);
        }

        const langNames = languages.map((l) => l.name).join(", ");
        setFormData({
          name: `${vendor.fname || ""} ${vendor.lname || ""}`.trim(),
          specialty: rituals.length
            ? rituals.map((r) => r.ritual_name).join(", ")
            : t.noRituals,
          location: vendor.address || "",
          languages: langNames,
          phone: vendor.phone || "",
          experience: vendor.experience || "",
          latitude: vendor.latitude || "",
          longitude: vendor.longitude || "",
        });
      } else {
        toast.error(t.profileFailed);
      }
    } catch {
      toast.error(t.apiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
    fetchTemples();
    fetchProfile();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".idtype-dropdown")) setShowIdTypeDropdown(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setIsSaving(true);
        const vendorPayload = {
          fname: formData.name.trim(),
          lname: "",
          address: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          phone: formData.phone,
          language_ids: selectedLangIds,
          bank_details: JSON.stringify(bankDetails),
          thumb: thumbUrl,
        };
        const res = await Apiconnect.postData("vendor/vendorupdate", vendorPayload);
        if (res.data?.status !== 1) {
          toast.error(res.data?.message || t.profileUpdateFailed);
          return;
        }

        const templeRes = await Apiconnect.postData("vendor/update_temples", {
          temple_ids: selectedTempleIds,
        });
        if (templeRes.data?.status !== 1) {
          toast.error(t.templeUpdateFailed);
          return;
        }

        toast.success(t.profileUpdated);
        setIsEditing(false);
        fetchProfile();
      } catch {
        toast.error(t.updateFailed);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDeleteLanguage = (id, name) => {
    Helper.handleDelete(id, name, "vendor/remove_panditlanguage", fetchProfile);
  };

  const handleDeleteTemple = (id, name) => {
    setSelectedTempleIds((prev) => prev.filter((tid) => tid !== id));
    Helper.handleDelete(id, name, "vendor/remove_temple", fetchProfile);
  };

  /* ── PROFILE PICTURE CROP & UPLOAD ── */
  const handleProfFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfRawSrc(reader.result);
      setProfCrop(undefined);
      setProfCompletedCrop(null);
      setShowProfCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onProfImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setProfCrop(centerAspectCrop(width, height, 1));
  };

  const handleProfCropAndUpload = async () => {
    if (!profCompletedCrop || !profImgRef.current) {
      toast.error(t.selectCropArea);
      return;
    }
    try {
      setIsProfUploading(true);
      const img = profImgRef.current;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const pixelCrop = {
        x: profCompletedCrop.x * scaleX,
        y: profCompletedCrop.y * scaleY,
        width: profCompletedCrop.width * scaleX,
        height: profCompletedCrop.height * scaleY,
      };
      const blob = await getCroppedBlob(profRawSrc, pixelCrop);

      const fd = new FormData();
      fd.append("files", blob, "profile.jpg");
      fd.append("folder", "logo");

      const res = await Apiconnect.postData("upload", fd);
      if (res.data?.success) {
        const fileUrl = res.data.files?.[0]?.url || "";
        setThumbUrl(fileUrl);
        setShowProfCropModal(false);
        toast.success(t.profImgUploaded);
      } else {
        toast.error(res.data?.message || t.uploadFailed);
      }
    } catch {
      toast.error(t.somethingWrong);
    } finally {
      setIsProfUploading(false);
    }
  };

  /* ── ID PROOF CROP & UPLOAD ── */
  const handleIdFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setIdRawSrc(reader.result);
      setIdCrop(undefined);
      setIdCompletedCrop(null);
      setIdCroppedPreview(null);
      setShowIdCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onIdImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setIdCrop(centerAspectCrop(width, height, 16 / 9));
  };

  const handleIdCropAndUpload = async () => {
    if (!idCompletedCrop || !idImgRef.current) {
      toast.error(t.selectCropArea);
      return;
    }
    if (!idProofTyp) {
      toast.error(t.selectIdFirst);
      return;
    }
    try {
      setIsIdUploading(true);
      const img = idImgRef.current;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const pixelCrop = {
        x: idCompletedCrop.x * scaleX,
        y: idCompletedCrop.y * scaleY,
        width: idCompletedCrop.width * scaleX,
        height: idCompletedCrop.height * scaleY,
      };
      const blob = await getCroppedBlob(idRawSrc, pixelCrop);
      setIdCroppedPreview(URL.createObjectURL(blob));
      const fd = new FormData();
      fd.append("files", blob, "id_proof.jpg");
      fd.append("folder", "id_proof");
      const res = await Apiconnect.postData("upload", fd);
      if (res.data?.success) {
        const fileUrl = res.data.files?.[0]?.url;
        setIdUploadedUrl(fileUrl);
        setIdUploadedOk(true);
        setShowIdCropModal(false);
        toast.success(t.idUploaded);
      } else {
        toast.error(res.data?.message || t.uploadFailed);
      }
    } catch {
      toast.error(t.uploadFailed);
    } finally {
      setIsIdUploading(false);
    }
  };

  /* ── PAYMENT CROP & UPLOAD ── */
  const handlePayFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPayRawSrc(reader.result);
      setShowPayCropModal(true);
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const onPayImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setPayCrop(
      centerCrop(
        makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
        width,
        height,
      ),
    );
  };

  const getPayCroppedBlob = async () => {
    const img = payImgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = payCompletedCrop.width * scaleX;
    canvas.height = payCompletedCrop.height * scaleY;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      payCompletedCrop.x * scaleX,
      payCompletedCrop.y * scaleY,
      payCompletedCrop.width * scaleX,
      payCompletedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  };

  const handlePayCropDone = async () => {
    if (!payCompletedCrop) {
      toast.error(t.selectCropArea);
      return;
    }
    const blob = await getPayCroppedBlob();
    setPayFile(blob);
    setPayRawSrc(null);
    setShowPayCropModal(false);
    toast.success(t.imageReady2);
  };

  const handleResubmit = async () => {
    setIsSubmittingVerify(true);
    try {
      const uploadData = new FormData();
      uploadData.append("files", payFile);
      uploadData.append("folder", "paymentdetail");
      const uploadRes = await Apiconnect.postData("upload", uploadData);
      if (!uploadRes.data?.success) {
        toast.error(uploadRes.data?.message || t.payImgUploadFailed);
        return;
      }
      const paymentImageUrl = uploadRes.data.files?.[0]?.url;
      if (!paymentImageUrl) {
        toast.error(t.payImgInvalid);
        return;
      }

      const payload = {
        id_proof_typ: idProofTyp,
        id_proof: idUploadedUrl,
        payment_info: JSON.stringify([
          {
            payment_mode: "upi",
            payment_id: transactionId,
            payment_image: paymentImageUrl,
          },
        ]),
        payment_id: transactionId,
        payment_sts: 0,
        payment_date: new Date().toISOString(),
      };
      console.log(payload);
      const res = await Apiconnect.postData("vendor/vendorupdate", payload);
      if (res.data?.status === 1) {
        toast.success(t.resubmitSuccess);
        fetchProfile();
      } else {
        toast.error(res.data?.message || t.resubmitFailed);
      }
    } catch {
      toast.error(t.somethingWrong);
    } finally {
      setIsSubmittingVerify(false);
    }
  };

  const selectedIdType = ID_PROOF_TYPES.find((opt) => opt.value === idProofTyp);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCsWlC4v29952IWXd1SFaIenTaiiV6blN0"
      libraries={["places"]}
    >
      <>
        <style>{`
* {
  transition: all 0.25s ease-in-out; box-sizing: border-box; margin: 0; padding: 0;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.page {
  max-width: 896px;
  margin: 0 auto;
  padding: 1.5rem 1rem 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #fff;
  animation: fadeIn 0.5s ease-in-out;
}
.page-titlee {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 1.25rem;
}
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  overflow: hidden;
}
.banner {
  height: 96px;
  background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(147,51,234,0.2));
  position: relative;
}
.avatar-wrap {
  position: absolute;
  bottom: 0;
  left: 24px;
  transform: translateY(50%);
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  border: 4px solid #020617;
  object-fit: cover;
  display: block;
}
.avatar-cam {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #6a0dad;
  border: 2px solid #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.avatar-cam span {
  font-size: 12px;
  color: #fff;
}
.card-body {
  padding: 48px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.profile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.name {
  font-size: 18px;
  font-weight: 700;
  color:#fff;
}
.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}
.edit-btn {
  font-size: 12px;
  padding: 0 12px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  cursor: pointer;
  font-weight: 500;
}
.field label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
}
.field input,
.field select {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 12px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  opacity: 1;
}
.field select option {
  background: #0f172a;
  color: #fff;
}
.field input:focus,
.field select:focus {
  border-color: rgba(245, 158, 11, 0.5);
  opacity: 1;
}
.hold-section {
  margin-top: 24px;
  border-radius: 16px;
  border: 1.5px solid rgba(239,68,68,0.35);
  background: rgba(239,68,68,0.06);
  overflow: hidden;
}
.hold-banner {
  background: linear-gradient(135deg, rgba(239,68,68,0.25), rgba(220,38,38,0.15));
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.hold-banner-title {
  font-size: 15px;
  font-weight: 700;
  color: #fca5a5;
}
.hold-banner-sub {
  font-size: 12px;
  color: rgba(252,165,165,0.7);
  margin-top: 2px;
}
.hold-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.hold-reason-box {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: #fca5a5;
  line-height: 1.6;
}
.hold-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.hold-divider::before,
.hold-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.08);
}
.hold-label {
  display: block;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.hold-input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 10px 12px;
  color: #fff;
  font-size: 14px;
  outline: none;
}
.hold-input:focus {
  border-color: rgba(245,158,11,0.5);
}
.hold-upload-box {
  width: 100%;
  min-height: 80px;
  border-radius: 10px;
  border: 2px dashed rgba(245,158,11,0.3);
  background: rgba(245,158,11,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 14px;
}
.hold-submit-btn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #e08007;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.hold-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.idtype-trigger {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 10px 12px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  outline: none;
}
.idtype-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a0b2e;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  z-index: 20;
  margin-top: 4px;
}
.idtype-option {
  padding: 10px 14px;
  cursor: pointer;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.idtype-option:hover {
  background: rgba(255,213,105,0.08);
}
.crop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.78);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(6px);
}
.crop-modal {
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.crop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.crop-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.07);
}
.crop-cancel-btn {
  height: 36px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.55);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.crop-confirm-btn {
  height: 36px;
  padding: 0 18px;
  border-radius: 8px;
  border: none;
  background: #e08007;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
}
.crop-confirm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        `}</style>

        <div className="page">
          <h2 className="page-titlee">{t.pageTitle}</h2>

          {isLoading ? (
            <p style={{ color: "#aaa", textAlign: "center" }}>
              {t.loading}
            </p>
          ) : (
            <>
              <div className="card">
                <div className="banner">
                  <div className="avatar-wrap">
                    <img
                      className="avatar"
                      src={
                        thumbUrl ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX7ee_eHQeAbbAHOS77UmWW4QBo_NeZ73eUA&s"
                      }
                      alt="avatar"
                    />
                    <div
                      className="avatar-cam"
                      onClick={() => isEditing && profFileInput.current?.click()}
                      style={{
                        opacity: isEditing ? 1 : 0.4,
                        cursor: isEditing ? "pointer" : "default",
                      }}
                    >
                      <span className="material-symbols-outlined">
                        photo_camera
                      </span>
                    </div>
                    <input
                      ref={profFileInput}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleProfFileChange}
                    />
                  </div>
                </div>

                <div className="card-body">
                  <div className="profile-header">
                    <div>
                      <div className="name-row">
                        <h3 className="name">{formData.name}</h3>
                      </div>
                      <p className="subtitle">
                        {formData.specialty} · {formData.experience || 0} {t.yearsExp}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 6,
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg
                            key={i}
                            width={14}
                            height={14}
                            viewBox="0 0 24 24"
                            fill={
                              i <= Math.round(avgRating) ? "#fbbf24" : "none"
                            }
                            stroke="#fbbf24"
                            strokeWidth="2"
                          >
                            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                          </svg>
                        ))}
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#fbbf24",
                          }}
                        >
                          {Number(avgRating).toFixed(1)}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          ({totalReviews} {t.reviews})
                        </span>
                      </div>
                    </div>
                    <button
                      className="edit-btn"
                      onClick={handleEditToggle}
                      disabled={isSaving}
                    >
                      {isSaving ? t.saving : isEditing ? t.save : t.edit}
                    </button>
                  </div>

                  <div className="field">
                    <label>{t.fullName}</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="field">
                    <label>{t.specialty}</label>
                    <input
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  <div className="field">
                    <label>{t.location}</label>
                    {isEditing ? (
                      <Autocomplete
                        onLoad={onLoadAutocomplete}
                        onPlaceChanged={onPlaceChanged}
                      >
                        <input
                          type="text"
                          placeholder={t.searchAddress}
                          value={formData.location}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          className="hold-input"
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        name="location"
                        value={formData.location}
                        disabled
                      />
                    )}
                  </div>

                  <div className="field">
                    <label>{t.languages}</label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        color: "#fff",
                      }}
                    >
                      {selectedLangIds.map((id) => {
                        const lang = languageList.find((l) => l.id === id);
                        if (!lang) return null;
                        return (
                          <div
                            key={id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              background: "rgba(245,158,11,0.2)",
                              padding: "4px 8px",
                              borderRadius: "20px",
                              fontSize: "12px",
                            }}
                          >
                            🌐 {lang.name}
                            {isEditing && (
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#f87171",
                                  fontSize: "12px",
                                }}
                                onClick={() =>
                                  handleDeleteLanguage(id, lang.name)
                                }
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {isEditing && (
                      <select
                        style={{ marginTop: "10px" }}
                        onChange={(e) => {
                          const newId = Number(e.target.value);
                          if (!selectedLangIds.includes(newId)) {
                            const updated = [...selectedLangIds, newId];
                            setSelectedLangIds(updated);
                            const names = languageList
                              .filter((l) => updated.includes(l.id))
                              .map((l) => l.name)
                              .join(", ");
                            setFormData((prev) => ({
                              ...prev,
                              languages: names,
                            }));
                          }
                        }}
                      >
                        <option value="">{t.addLanguage}</option>
                        {languageList.map((lang) => (
                          <option key={lang.id} value={lang.id}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="field">
                    <label>{t.temples}</label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        color: "#fff",
                      }}
                    >
                      {selectedTempleIds.map((id) => {
                        const temple = templeList.find((tmp) => tmp.id === id);
                        if (!temple) return null;
                        return (
                          <div
                            key={id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              background: "rgba(147,51,234,0.2)",
                              padding: "4px 8px",
                              borderRadius: "20px",
                              fontSize: "12px",
                            }}
                          >
                            🛕 {temple.name}
                            {isEditing && (
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#f87171",
                                  fontSize: "12px",
                                }}
                                onClick={() =>
                                  handleDeleteTemple(id, temple.name)
                                }
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {isEditing && (
                      <select
                        value=""
                        style={{ marginTop: "10px" }}
                        onChange={(e) => {
                          const newId = Number(e.target.value);
                          if (!newId) return;
                          if (!selectedTempleIds.includes(newId))
                            setSelectedTempleIds([...selectedTempleIds, newId]);
                        }}
                      >
                        <option value="">{t.addTemple}</option>
                        {templeList.map((temple) => (
                          <option
                            key={temple.id}
                            value={temple.id}
                            disabled={selectedTempleIds.includes(temple.id)}
                          >
                            {temple.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* ── BANK DETAILS ── */}
                  <div
                    style={{
                      marginTop: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setBankOpen((p) => !p)}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        border: "none",
                        background: "transparent",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ color: "#fbbf24" }}
                        >
                          account_balance
                        </span>
                        {t.bankDetails}
                      </div>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          transform: bankOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        expand_more
                      </span>
                    </button>

                    {bankOpen && (
                      <div style={{ padding: "0 16px 16px" }}>
                        <div className="field">
                          <label>{t.acctHolder}</label>
                          <input
                            value={bankDetails.account_holder_name}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setBankDetails((p) => ({
                                ...p,
                                account_holder_name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="field">
                          <label>{t.acctNumber}</label>
                          <input
                            value={bankDetails.account_number}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setBankDetails((p) => ({
                                ...p,
                                account_number: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="field">
                          <label>{t.ifsc}</label>
                          <input
                            value={bankDetails.ifsc_code}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setBankDetails((p) => ({
                                ...p,
                                ifsc_code: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="field">
                          <label>{t.branch}</label>
                          <input
                            value={bankDetails.branch_name}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setBankDetails((p) => ({
                                ...p,
                                branch_name: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="field">
                    <label>{t.phone}</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* ── HOLD SECTION (only when is_approved === 4) ── */}
              {vendorData?.is_approved === 4 && (
                <div className="hold-section">
                  <div className="hold-banner">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#fca5a5", fontSize: 22 }}
                    >
                      pause_circle
                    </span>
                    <div>
                      <div className="hold-banner-title">{t.accountOnHold}</div>
                      <div className="hold-banner-sub">{t.holdSubtitle}</div>
                    </div>
                  </div>

                  <div className="hold-body">
                    {holdInfo ? (
                      <div>
                        <div className="hold-label">{t.reasonFromAdmin}</div>
                        <div className="hold-reason-box">⚠️ {holdInfo}</div>
                      </div>
                    ) : null}

                    <div className="hold-divider">{t.resubmitDocs}</div>

                    {/* ── ID PROOF ── */}
                    <div>
                      <div className="hold-label">{t.idProofType}</div>
                      <div
                        className="idtype-dropdown"
                        style={{ position: "relative" }}
                      >
                        <div
                          className="idtype-trigger"
                          onClick={() => setShowIdTypeDropdown((p) => !p)}
                        >
                          {selectedIdType ? (
                            <>
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 17, color: "#ffd569" }}
                              >
                                {selectedIdType.icon}
                              </span>
                              {isHindi ? selectedIdType.label_hi : selectedIdType.label_en}
                            </>
                          ) : (
                            <span style={{ color: "rgba(255,255,255,0.35)" }}>
                              {t.selectIdType}
                            </span>
                          )}
                          <span
                            className="material-symbols-outlined"
                            style={{
                              marginLeft: "auto",
                              fontSize: 18,
                              color: "rgba(255,255,255,0.3)",
                            }}
                          >
                            {showIdTypeDropdown ? "expand_less" : "expand_more"}
                          </span>
                        </div>
                        {showIdTypeDropdown && (
                          <div className="idtype-dropdown-menu">
                            {ID_PROOF_TYPES.map((opt) => (
                              <div
                                key={opt.value}
                                className="idtype-option"
                                style={{
                                  background:
                                    idProofTyp === opt.value
                                      ? "rgba(255,213,105,0.1)"
                                      : "transparent",
                                  color:
                                    idProofTyp === opt.value
                                      ? "#ffd569"
                                      : "#fff",
                                }}
                                onClick={() => {
                                  setIdProofTyp(opt.value);
                                  setShowIdTypeDropdown(false);
                                }}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: 17 }}
                                >
                                  {opt.icon}
                                </span>
                                {isHindi ? opt.label_hi : opt.label_en}
                                {idProofTyp === opt.value && (
                                  <span
                                    className="material-symbols-outlined"
                                    style={{ marginLeft: "auto", fontSize: 15 }}
                                  >
                                    check
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <div className="hold-label">{t.idProofImage}</div>
                        <div
                          className="hold-upload-box"
                          onClick={() => idFileInput.current?.click()}
                        >
                          {idCroppedPreview ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <img
                                src={idCroppedPreview}
                                alt="ID proof"
                                style={{
                                  height: 56,
                                  borderRadius: 8,
                                  border: "1px solid rgba(255,255,255,0.15)",
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    color: "#6ee7b7",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                  }}
                                >
                                  <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 15 }}
                                  >
                                    check_circle
                                  </span>
                                  {t.uploadedSuccessfully}
                                </div>
                                <div
                                  style={{
                                    color: "rgba(255,255,255,0.35)",
                                    fontSize: 11,
                                    marginTop: 2,
                                  }}
                                >
                                  {t.clickToChange}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ textAlign: "center" }}>
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize: 32,
                                  color: "rgba(255,213,105,0.4)",
                                  display: "block",
                                  marginBottom: 6,
                                }}
                              >
                                add_photo_alternate
                              </span>
                              <div
                                style={{
                                  color: "rgba(255,255,255,0.4)",
                                  fontSize: 13,
                                }}
                              >
                                {t.clickToUploadId}
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          ref={idFileInput}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleIdFileChange}
                        />
                      </div>
                    </div>

                    <div className="hold-divider">{t.paymentDetails}</div>

                    {/* ── PAYMENT ── */}
                    <div>
                      <div className="hold-label">{t.transactionId}</div>
                      <input
                        className="hold-input"
                        type="text"
                        placeholder={t.enterTransactionId}
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="hold-label">{t.paymentProofImage}</div>
                      <div
                        className="hold-upload-box"
                        onClick={() => payFileInput.current?.click()}
                      >
                        {payFile ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <img
                              src={URL.createObjectURL(payFile)}
                              alt="payment proof"
                              style={{
                                height: 56,
                                borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.15)",
                              }}
                            />
                            <div>
                              <div
                                style={{
                                  color: "#6ee7b7",
                                  fontWeight: 600,
                                  fontSize: 13,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                }}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: 15 }}
                                >
                                  check_circle
                                </span>
                                {t.imageReady}
                              </div>
                              <div
                                style={{
                                  color: "rgba(255,255,255,0.35)",
                                  fontSize: 11,
                                  marginTop: 2,
                                }}
                              >
                                {t.clickToChange}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            <span
                              className="material-symbols-outlined"
                              style={{
                                fontSize: 32,
                                color: "rgba(255,213,105,0.4)",
                                display: "block",
                                marginBottom: 6,
                              }}
                            >
                              receipt_long
                            </span>
                            <div
                              style={{
                                color: "rgba(255,255,255,0.4)",
                                fontSize: 13,
                              }}
                            >
                              {t.uploadPaymentProof}
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        ref={payFileInput}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handlePayFileChange}
                      />
                    </div>

                    <button
                      className="hold-submit-btn"
                      onClick={handleResubmit}
                      disabled={isSubmittingVerify}
                    >
                      {isSubmittingVerify ? t.submitting : t.resubmitBtn}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── PROFILE PICTURE CROP MODAL ── */}
        {showProfCropModal && profRawSrc && (
          <div
            className="crop-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowProfCropModal(false);
            }}
          >
            <div className="crop-modal">
              <div className="crop-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#ffd569", fontSize: 20 }}
                  >
                    crop
                  </span>
                  <span
                    style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}
                  >
                    {t.cropProfile}
                  </span>
                </div>
                <button
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "none",
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onClick={() => setShowProfCropModal(false)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    close
                  </span>
                </button>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                {t.dragToAdjust}
              </div>
              <div
                style={{
                  maxHeight: "55vh",
                  overflow: "auto",
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <ReactCrop
                  crop={profCrop}
                  onChange={(c) => setProfCrop(c)}
                  onComplete={(c) => setProfCompletedCrop(c)}
                  aspect={1}
                  style={{ maxWidth: "100%" }}
                >
                  <img
                    ref={profImgRef}
                    src={profRawSrc}
                    alt="crop source"
                    style={{ maxWidth: "100%", display: "block" }}
                    onLoad={onProfImageLoad}
                  />
                </ReactCrop>
              </div>
              <div className="crop-footer">
                <button
                  className="crop-cancel-btn"
                  onClick={() => setShowProfCropModal(false)}
                >
                  {t.cancel}
                </button>
                <button
                  className="crop-confirm-btn"
                  onClick={handleProfCropAndUpload}
                  disabled={isProfUploading}
                >
                  {isProfUploading ? (
                    t.uploading
                  ) : (
                    <>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16 }}
                      >
                        cloud_upload
                      </span>
                      {t.cropAndUpload}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ID PROOF CROP MODAL ── */}
        {showIdCropModal && idRawSrc && (
          <div
            className="crop-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIdCropModal(false);
            }}
          >
            <div className="crop-modal">
              <div className="crop-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#ffd569", fontSize: 20 }}
                  >
                    crop
                  </span>
                  <span
                    style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}
                  >
                    {t.cropIdProof}
                  </span>
                </div>
                <button
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "none",
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onClick={() => setShowIdCropModal(false)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                  >
                    close
                  </span>
                </button>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                {t.dragToCropId}
              </div>
              <div
                style={{
                  maxHeight: "55vh",
                  overflow: "auto",
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <ReactCrop
                  crop={idCrop}
                  onChange={(c) => setIdCrop(c)}
                  onComplete={(c) => setIdCompletedCrop(c)}
                  style={{ maxWidth: "100%" }}
                >
                  <img
                    ref={idImgRef}
                    src={idRawSrc}
                    alt="crop source"
                    style={{ maxWidth: "100%", display: "block" }}
                    onLoad={onIdImageLoad}
                  />
                </ReactCrop>
              </div>
              <div className="crop-footer">
                <button
                  className="crop-cancel-btn"
                  onClick={() => setShowIdCropModal(false)}
                >
                  {t.cancel}
                </button>
                <button
                  className="crop-confirm-btn"
                  onClick={handleIdCropAndUpload}
                  disabled={isIdUploading}
                >
                  {isIdUploading ? (
                    t.uploading
                  ) : (
                    <>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16 }}
                      >
                        cloud_upload
                      </span>{" "}
                      {t.cropAndUpload}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PAYMENT CROP MODAL ── */}
        {showPayCropModal && payRawSrc && (
          <div
            className="crop-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowPayCropModal(false);
            }}
          >
            <div className="crop-modal">
              <div className="crop-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#ffd569", fontSize: 20 }}
                  >
                    crop
                  </span>
                  <span
                    style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}
                  >
                    {t.cropPayment}
                  </span>
                </div>
                <button
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "none",
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onClick={() => setShowPayCropModal(false)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                  >
                    close
                  </span>
                </button>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                {t.dragToSelect}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: 8,
                  background: "#000",
                }}
              >
                <ReactCrop
                  crop={payCrop}
                  onChange={(c) => setPayCrop(c)}
                  onComplete={(c) => setPayCompletedCrop(c)}
                >
                  <img
                    ref={payImgRef}
                    src={payRawSrc}
                    onLoad={onPayImageLoad}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "55vh",
                      display: "block",
                    }}
                    alt="pay-crop"
                  />
                </ReactCrop>
              </div>
              <div className="crop-footer">
                <button
                  className="crop-cancel-btn"
                  onClick={() => setShowPayCropModal(false)}
                >
                  {t.cancel}
                </button>
                <button
                  className="crop-confirm-btn"
                  onClick={handlePayCropDone}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    crop
                  </span>{" "}
                  {t.cropAndSave}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </LoadScript>
  );
};

export default ProfileManagement;