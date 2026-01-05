import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";

export default function Bookstore() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { language } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");

        // SAFE handling for different backend responses
        const data =
          response?.data?.books ||
          response?.data ||
          [];

        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(
          language === "en"
            ? "Failed to load books"
            : "किताबें लोड नहीं हो सकीं"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [language]);

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(
      language === "en"
        ? "Added to cart!"
        : "कार्ट में जोड़ा गया!"
    );
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B6FFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
            data-testid="bookstore-title"
          >
            {language === "en" ? "Bookstore" : "पुस्तक भंडार"}
          </h1>
          <p className="text-lg text-slate-600">
            {language === "en"
              ? "Quality books for comprehensive learning"
              : "व्यापक शिक्षा के लिए गुणवत्ता पुस्तकें"}
          </p>
        </div>

        {/* Empty state */}
        {books.length === 0 ? (
          <div className="text-center text-slate-600">
            {language === "en"
              ? "No books available right now."
              : "अभी कोई पुस्तक उपलब्ध नहीं है।"}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div
                key={book.id || book._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 overflow-hidden"
                data-testid={`book-card-${book.id || book._id}`}
              >
                {/* Image */}
                <div className="aspect-[3/4] bg-slate-100">
                  <img
                    src={book.image || "/placeholder-book.png"}
                    alt={book.title || "Book"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {language === "en"
                      ? book.title
                      : book.title_hi || book.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {language === "en"
                      ? book.description
                      : book.description_hi || book.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-[#0B6FFF]">
                      ₹{book.price}
                    </div>

                    {book.pages && (
                      <div className="text-sm text-slate-500">
                        {book.pages}{" "}
                        {language === "en" ? "pages" : "पृष्ठ"}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleAddToCart(book)}
                    className="w-full bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full"
                    data-testid={`add-to-cart-${book.id || book._id}`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {language === "en"
                      ? "Add to Cart"
                      : "कार्ट में जोड़ें"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
