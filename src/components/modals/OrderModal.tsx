'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Lock, CreditCard, QrCode, FileText, Send, CheckCircle2, Info,
  UploadCloud, Paperclip, Trash2, CheckCircle, File
} from 'lucide-react';
import QrisPaymentModal from './QrisPaymentModal';
import { useAuth } from '@/context/AuthContext';

interface ServiceItem {
  id: number;
  category: string;
  name: string;
  price: string;
  icon?: any;
  badge?: string | null;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
}

// Reusable File Upload Card (Matching Dribbble Reference)
function FileUploadCard({
  label,
  required = false,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value?: { name: string; size: string } | null;
  onChange: (fileInfo: { name: string; size: string } | null) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert bytes to KB/MB
    let sizeStr = '';
    if (file.size > 1024 * 1024) {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
    }

    onChange({ name: file.name, size: sizeStr });
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-dark-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="bg-gray-50/80 border-2 border-dashed border-gray-300 hover:border-primary-800 rounded-2xl p-5 transition-all text-center relative group">
        <input
          type="file"
          required={required && !value}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {value ? (
          <div className="flex items-center justify-between bg-white border border-green-200 rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                <File className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-dark-800 truncate">{value.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{value.size} • Ter-upload</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer z-20"
              title="Hapus File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-center text-primary-800 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark-800">Upload Dokumen / File Tugas</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Drag & drop atau klik browse dari perangkat</p>
            </div>
            <span className="inline-block bg-white border border-gray-300 text-dark-700 font-semibold text-[11px] px-3.5 py-1.5 rounded-lg shadow-2xs group-hover:border-primary-800 group-hover:text-primary-800 transition-colors">
              Browse File
            </span>
            <p className="text-[9px] text-gray-400">Mendukung Word, PDF, PPT, ZIP, RAR, TXT, Gambar (Maks 25MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderModal({ isOpen, onClose, service }: OrderModalProps) {
  const { user } = useAuth();

  // Base Form
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'qris'>('transfer');

  // Custom Fields per category
  const [formData, setFormData] = useState<Record<string, string>>({});

  // File upload state for Card Upload File
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  // Sub-modal state for QRIS
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Auto fill name if user logged in
  useEffect(() => {
    if (isOpen) {
      if (user?.name) {
        setCustomerName(user.name);
      } else {
        setCustomerName('');
      }
      setPaymentMethod('transfer');
      setFormData({});
      setUploadedFile(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !service) return null;

  const handleInputChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const saveOrderToCloud = async (orderPayload: any) => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.error('Failed saving order:', err);
    }
  };

  const isChatAdminPrice =
    service.price?.toLowerCase().includes('chat') ||
    service.price?.toLowerCase().includes('tanya') ||
    service.price?.toLowerCase().includes('admin');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setLoading(true);

    const mergedFormData = { ...formData };
    if (uploadedFile) {
      mergedFormData['File Ter-upload'] = `${uploadedFile.name} (${uploadedFile.size})`;
    }

    const orderId = `ORD-${Date.now()}`;
    const orderPayload = {
      id: orderId,
      customerName,
      customerEmail: user?.email || 'Guest',
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      price: service.price,
      paymentMethod: isChatAdminPrice
        ? 'Diskusi Admin (Custom Price)'
        : paymentMethod === 'qris'
        ? 'QRIS'
        : 'Transfer Bank / E-Wallet',
      paymentStatus: isChatAdminPrice
        ? 'Konsultasi Harga Admin'
        : paymentMethod === 'qris'
        ? 'Lunas (Menunggu Konfirmasi Admin)'
        : 'Menunggu Transfer',
      customFields: mergedFormData,
      createdAt: new Date().toISOString(),
    };

    if (isChatAdminPrice) {
      await saveOrderToCloud(orderPayload);

      let detailsText = `*KONSULTASI & DISKUSI HARGA LAYANAN*\n`;
      detailsText += `🆔 ID Order: ${orderPayload.id}\n`;
      detailsText += `👤 Nama Pemesan: ${customerName}\n`;
      detailsText += `📌 Jenis Jasa: ${service.name}\n`;
      detailsText += `💰 Total Harga: Chat Admin (Diskusi Kebutuhan)\n\n`;

      if (Object.keys(mergedFormData).length > 0) {
        detailsText += `*DETAIL FORMULIR KEBUTUHAN:*\n`;
        Object.entries(mergedFormData).forEach(([k, v]) => {
          if (v) detailsText += `• ${k}: ${v}\n`;
        });
        detailsText += `\n`;
      }

      detailsText += `Halo Admin Soobin Services, saya ingin berkonsultasi mengenai estimasi harga & alur pengerjaan untuk layanan di atas. Mohon info selanjutnya, terima kasih!`;

      const waUrl = `https://wa.me/6287815797525?text=${encodeURIComponent(detailsText)}`;
      window.open(waUrl, '_blank');

      setLoading(false);
      onClose();
      return;
    }

    if (paymentMethod === 'qris') {
      setCreatedOrderData(orderPayload);
      setShowQrisModal(true);
      setLoading(false);
    } else {
      // Transfer Flow -> Save to Cloud API & redirect to WA
      await saveOrderToCloud(orderPayload);

      let detailsText = `*DETAIL PESANAN BARU*\n`;
      detailsText += `🆔 ID Order: ${orderPayload.id}\n`;
      detailsText += `👤 Nama: ${customerName}\n`;
      detailsText += `📌 Jenis Jasa: ${service.name}\n`;
      detailsText += `💰 Harga: ${service.price}\n`;
      detailsText += `💳 Metode Pembayaran: Transfer Bank / E-Wallet\n`;
      detailsText += `STATUS: Menunggu Transfer (Check Admin)\n\n`;

      if (Object.keys(mergedFormData).length > 0) {
        detailsText += `*DETAIL FORMULIR LAYANAN:*\n`;
        Object.entries(mergedFormData).forEach(([k, v]) => {
          if (v) detailsText += `• ${k}: ${v}\n`;
        });
      }

      detailsText += `\nHalo Admin Soobin Services, saya ingin memproses pesanan di atas via transfer. Mohon dikirimkan nomor rekening / e-wallet. Terima kasih!`;

      const waUrl = `https://wa.me/6287815797525?text=${encodeURIComponent(detailsText)}`;
      window.open(waUrl, '_blank');

      setLoading(false);
      onClose();
    }
  };

  const handleQrisPaymentSuccess = async (proofBase64: string) => {
    if (!createdOrderData) return;

    const mergedFormData = { ...formData };
    if (uploadedFile) {
      mergedFormData['File Ter-upload'] = `${uploadedFile.name} (${uploadedFile.size})`;
    }

    const finalOrder = {
      ...createdOrderData,
      customFields: mergedFormData,
      paymentStatus: 'LUNAS (Cek Admin)',
      proofImage: proofBase64,
    };

    await saveOrderToCloud(finalOrder);

    let detailsText = `*DETAIL PESANAN (PEMBAYARAN QRIS LUNAS)*\n`;
    detailsText += `🆔 ID Order: ${finalOrder.id}\n`;
    detailsText += `👤 Nama Pemesan: ${customerName}\n`;
    detailsText += `📌 Jenis Jasa: ${service.name}\n`;
    detailsText += `💰 Total Harga: ${service.price}\n`;
    detailsText += `💳 Metode Pembayaran: QRIS (Scan Barcode)\n`;
    detailsText += `✅ *STATUS PEMBAYARAN: QRIS - LUNAS*\n\n`;

    if (Object.keys(mergedFormData).length > 0) {
      detailsText += `*DETAIL FORMULIR PESANAN:*\n`;
      Object.entries(mergedFormData).forEach(([k, v]) => {
        if (v) detailsText += `• ${k}: ${v}\n`;
      });
      detailsText += `\n`;
    }

    detailsText += `Saya sudah melampirkan screenshot bukti pembayaran QRIS pada aplikasi. Mohon Admin mengecek dan memverifikasi pesanan saya. Terima kasih!`;

    const waUrl = `https://wa.me/6287815797525?text=${encodeURIComponent(detailsText)}`;
    window.open(waUrl, '_blank');

    setShowQrisModal(false);
    onClose();
  };

  // Render specific form inputs based on category
  const renderCategoryFields = () => {
    const cat = service.category;

    if (cat === 'turnitin') {
      return (
        <>
          <FileUploadCard
            label="Upload Dokumen / File Tugas"
            required={true}
            value={uploadedFile}
            onChange={setUploadedFile}
          />
          <div>
            <label className="block text-xs font-bold text-dark-800 mb-1">Catatan Tambahan</label>
            <textarea
              rows={2}
              placeholder="Contoh: Tolong sertakan filter bibliography dan quotes..."
              value={formData['Catatan'] || ''}
              onChange={(e) => handleInputChange('Catatan', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
            />
          </div>
        </>
      );
    }

    if (cat === 'parafrase') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">
                Jumlah Halaman <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="Contoh: 15"
                value={formData['Jumlah Halaman'] || ''}
                onChange={(e) => handleInputChange('Jumlah Halaman', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Target Similarity (%)</label>
              <input
                type="text"
                placeholder="Contoh: < 20%"
                value={formData['Target Similarity'] || ''}
                onChange={(e) => handleInputChange('Target Similarity', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
              />
            </div>
          </div>
          <FileUploadCard
            label="Upload Dokumen Skripsi / File Dokumen"
            required={true}
            value={uploadedFile}
            onChange={setUploadedFile}
          />
        </>
      );
    }

    if (cat === 'joki-tugas' || cat === 'tugas-sekolah') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Mata Kuliah / Pelajaran</label>
              <input
                type="text"
                placeholder="Contoh: Metodologi Penelitian"
                value={formData['Mata Kuliah/Pelajaran'] || ''}
                onChange={(e) => handleInputChange('Mata Kuliah/Pelajaran', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Besok Jam 20:00 WIB"
                value={formData['Deadline'] || ''}
                onChange={(e) => handleInputChange('Deadline', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
              />
            </div>
          </div>
          <FileUploadCard
            label="Upload File Soal / Lampiran Tugas (Opsional)"
            required={false}
            value={uploadedFile}
            onChange={setUploadedFile}
          />
          <div>
            <label className="block text-xs font-bold text-dark-800 mb-1">
              Topik / Detail Instruksi Tugas <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan detail instruksi tugas, format pengumpulan, dll..."
              value={formData['Instruksi Tugas'] || ''}
              onChange={(e) => handleInputChange('Instruksi Tugas', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
            />
          </div>
        </>
      );
    }

    if (cat === 'uji-data') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Software / Software Uji</label>
              <select
                value={formData['Software Uji'] || 'SPSS'}
                onChange={(e) => handleInputChange('Software Uji', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
              >
                <option value="SPSS">SPSS</option>
                <option value="SmartPLS">SmartPLS</option>
                <option value="AMOS">AMOS</option>
                <option value="Stata">Stata</option>
                <option value="EViews">EViews</option>
                <option value="Python/R">Python / R</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Jumlah Sampel / Responden</label>
              <input
                type="text"
                placeholder="Contoh: 100 Sampel"
                value={formData['Jumlah Sampel'] || ''}
                onChange={(e) => handleInputChange('Jumlah Sampel', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
              />
            </div>
          </div>
          <FileUploadCard
            label="Upload Mentahan Data / Kuesioner (Opsional)"
            required={false}
            value={uploadedFile}
            onChange={setUploadedFile}
          />
          <div>
            <label className="block text-xs font-bold text-dark-800 mb-1">
              Judul Penelitian / Variabel <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Tuliskan judul penelitian dan variabel X & Y..."
              value={formData['Judul Penelitian'] || ''}
              onChange={(e) => handleInputChange('Judul Penelitian', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
            />
          </div>
        </>
      );
    }

    if (cat === 'joki-skripsi' || cat === 'laporan-akademik') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Jurusan / Program Studi</label>
              <input
                type="text"
                placeholder="Contoh: Manajemen / Teknik"
                value={formData['Jurusan/Prodi'] || ''}
                onChange={(e) => handleInputChange('Jurusan/Prodi', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Bab yang Diorder</label>
              <input
                type="text"
                placeholder="Contoh: Bab 1, 2, & 3"
                value={formData['Bab Skripsi'] || ''}
                onChange={(e) => handleInputChange('Bab Skripsi', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
              />
            </div>
          </div>
          <FileUploadCard
            label="Upload Pedoman Kampus / File Skripsi (Opsional)"
            required={false}
            value={uploadedFile}
            onChange={setUploadedFile}
          />
          <div>
            <label className="block text-xs font-bold text-dark-800 mb-1">
              Judul Skripsi / Penelitian <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Judul skripsi lengkap..."
              value={formData['Judul Skripsi'] || ''}
              onChange={(e) => handleInputChange('Judul Skripsi', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
            />
          </div>
        </>
      );
    }

    // Default Fallback Form
    return (
      <>
        <FileUploadCard
          label="Upload File Dokumen (Opsional)"
          required={false}
          value={uploadedFile}
          onChange={setUploadedFile}
        />
        <div>
          <label className="block text-xs font-bold text-dark-800 mb-1">
            Deskripsi Kebutuhan Pesanan <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Tuliskan detail pesanan atau spesifikasi kebutuhan Anda..."
            value={formData['Deskripsi Kebutuhan'] || ''}
            onChange={(e) => handleInputChange('Deskripsi Kebutuhan', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-dark-800 mb-1">Deadline Penggerjaan</label>
          <input
            type="text"
            placeholder="Contoh: 3 Hari / Tgl 5 Agustus"
            value={formData['Deadline'] || ''}
            onChange={(e) => handleInputChange('Deadline', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white"
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden my-6 border border-gray-100"
        >
          {/* Modal Header */}
          <div className="bg-primary-800 text-white p-5 flex items-center justify-between">
            <div>
              <span className="bg-amber-400 text-dark-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide">
                Form Pemesanan
              </span>
              <h3 className="font-bold text-lg mt-1 leading-snug">{service.name}</h3>
              <p className="text-xs text-primary-200 font-semibold">{service.price}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">
                Nama Lengkap Pemesan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan nama Anda"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-dark-800 focus:outline-none focus:border-primary-800 focus:bg-white font-medium"
              />
            </div>

            {/* Service Name (UNEDITABLE / LOCKED) */}
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1 flex items-center justify-between">
                <span>Jenis Jasa Layanan</span>
                <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-500" /> Otomatis & Terkunci
                </span>
              </label>
              <div className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-primary-900 flex items-center justify-between select-none">
                <span>{service.name}</span>
                <span className="text-[10px] bg-primary-800/10 text-primary-800 font-bold px-2 py-0.5 rounded">
                  {service.price}
                </span>
              </div>
            </div>

            {/* Dynamic Category Fields */}
            {renderCategoryFields()}

            {/* Payment Method Selector (Only for fixed-price services) */}
            {!isChatAdminPrice ? (
              <>
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <label className="block text-xs font-bold text-dark-800">
                    Pilih Metode Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Transfer Bank Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                        paymentMethod === 'transfer'
                          ? 'border-primary-800 bg-primary-800/5 text-primary-900 font-bold shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-gray-50'
                      }`}
                    >
                      <CreditCard className={`w-5 h-5 ${paymentMethod === 'transfer' ? 'text-primary-800' : 'text-gray-400'}`} />
                      <span className="text-xs">Transfer Bank / E-Wallet</span>
                      <span className="text-[9px] text-gray-400 font-normal">Konfirmasi via Admin</span>
                    </button>

                    {/* QRIS Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                        paymentMethod === 'qris'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-gray-50'
                      }`}
                    >
                      <QrCode className={`w-5 h-5 ${paymentMethod === 'qris' ? 'text-amber-600' : 'text-gray-400'}`} />
                      <span className="text-xs">QRIS (Scan Barcode)</span>
                      <span className="text-[9px] text-amber-600 font-bold">Timer 5 Menit & Instant</span>
                    </button>
                  </div>
                </div>

                {/* Info note */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-blue-800">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    {paymentMethod === 'qris'
                      ? 'Pembayaran QRIS dilengkapi timer 5 menit dan form upload bukti transfer.'
                      : 'Pesanan akan diproses oleh Admin via WhatsApp setelah form dikirimkan.'}
                  </span>
                </div>
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900">
                <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Layanan ini memerlukan estimasi harga kustom. Silakan lengkapi form di atas dan klik tombol di bawah untuk berdiskusi & negosiasi harga langsung dengan Admin via WhatsApp.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-800 hover:bg-primary-750 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {loading ? (
                <span>Memproses Pesanan...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {isChatAdminPrice
                      ? 'Konsultasi & Tanya Harga via Admin'
                      : paymentMethod === 'qris'
                      ? 'Lanjut Pembayaran QRIS'
                      : 'Kirim Pesanan via WhatsApp'}
                  </span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* QRIS Payment Modal child */}
      {createdOrderData && (
        <QrisPaymentModal
          isOpen={showQrisModal}
          onClose={() => setShowQrisModal(false)}
          orderData={createdOrderData}
          onPaymentSuccess={handleQrisPaymentSuccess}
        />
      )}
    </>
  );
}
