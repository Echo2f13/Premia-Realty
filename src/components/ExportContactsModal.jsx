import { useState } from "react";
import { X, Download, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { getAllContactsForExport } from "../data/firebaseService";

const ExportContactsModal = ({ onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState("xlsx"); // xlsx or csv
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return "";
    }
  };

  const formatBoolean = (value) => {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "";
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);

      // Fetch all contacts
      const contacts = await getAllContactsForExport(includeDeleted);

      if (contacts.length === 0) {
        setError("No contacts found to export");
        setIsExporting(false);
        return;
      }

      // Prepare data for export
      const exportData = contacts.map((contact) => ({
        Name: contact.name || "",
        Email: contact.email || "",
        Phone: contact.phone || "",
        City: contact.city || "",
        Message: contact.message || "",
        "Twilight Preview": formatBoolean(contact.twilightPreview),
        "Virtual Walkthrough": formatBoolean(contact.virtualWalkthrough),
        "Submitted At": formatTimestamp(contact.createdAt),
        "Deleted At": formatTimestamp(contact.deletedAt),
        "Deleted By": contact.deletedBy?.displayName || "",
      }));

      // Create workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

      // Set column widths
      const columnWidths = [
        { wch: 20 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 15 }, // City
        { wch: 40 }, // Message
        { wch: 18 }, // Twilight Preview
        { wch: 20 }, // Virtual Walkthrough
        { wch: 20 }, // Submitted At
        { wch: 20 }, // Deleted At
        { wch: 20 }, // Deleted By
      ];
      worksheet['!cols'] = columnWidths;

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `contacts_export_${timestamp}.${format}`;

      // Export file
      if (format === "csv") {
        XLSX.writeFile(workbook, filename, { bookType: "csv" });
      } else {
        XLSX.writeFile(workbook, filename);
      }

      // Close modal after successful export
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Export error:", error);
      setError(error.message || "Failed to export contacts");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-card border border-border/50 p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-foreground/70 transition hover:bg-accent/10 hover:text-foreground"
          aria-label="Close modal"
          disabled={isExporting}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b border-border/50 pb-4">
          <div className="text-accent text-xs tracking-[0.3em] mb-2">EXPORT</div>
          <h2 className="text-3xl text-foreground">Export Contacts</h2>
          <p className="mt-2 text-sm text-foreground/60">
            Download all contact submissions to Excel or CSV
          </p>
        </div>

        {/* Export Options */}
        <div className="mb-6 space-y-4">
          {/* File Format */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-accent">
              File Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="xlsx"
                  checked={format === "xlsx"}
                  onChange={(e) => setFormat(e.target.value)}
                  className="h-4 w-4 text-accent"
                  disabled={isExporting}
                />
                <span className="text-foreground">Excel (.xlsx)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === "csv"}
                  onChange={(e) => setFormat(e.target.value)}
                  className="h-4 w-4 text-accent"
                  disabled={isExporting}
                />
                <span className="text-foreground">CSV (.csv)</span>
              </label>
            </div>
          </div>

          {/* Include Deleted */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
                className="h-4 w-4 rounded text-accent"
                disabled={isExporting}
              />
              <span className="text-sm text-foreground">
                Include deleted contacts
              </span>
            </label>
          </div>
        </div>

        {/* Export Info */}
        <div className="mb-6 bg-background/50 border border-border/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-accent">Export Details</h3>
          <p className="text-sm text-foreground/60">
            The exported file will contain the following columns:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground/60">
            <li>Name, Email, Phone, City</li>
            <li>Message</li>
            <li>Twilight Preview, Virtual Walkthrough</li>
            <li>Submitted At</li>
            {includeDeleted && (
              <>
                <li>Deleted At</li>
                <li>Deleted By</li>
              </>
            )}
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-500/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-foreground/10 text-sm uppercase tracking-[0.15em] text-foreground transition hover:bg-foreground/20"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background text-sm uppercase tracking-[0.15em] transition hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExporting}
          >
            {isExporting ? (
              <>Exporting...</>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Contacts
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportContactsModal;
