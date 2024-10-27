import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { baseUrl } from "../../../api/baseUrl";

const OnlineBookViewer = () => {
  const [bookPdf, setBookPdf] = useState("");
  const { bookId } = useParams();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}${ApiEndpoints.getOnlineBookStream(bookId)}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      const pdfUrl = URL.createObjectURL(response.data);
      setBookPdf(pdfUrl);
    };

    fetchBook();

    return () => {
      if (bookPdf) {
        URL.revokeObjectURL(bookPdf);
      }
    };
  }, [bookId, token]);

  return (
    <div className="container mt-4">
      <h2>مشاهدة الكتاب</h2>
      {loading && <p>جاري تحميل الكتاب...</p>}
      {bookPdf && (
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <Viewer fileUrl={bookPdf} />
        </Worker>
      )}
    </div>
  );
};

export default OnlineBookViewer;
