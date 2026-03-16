import React, { useContext } from "react";
import { SelectionContext } from "../context/SelectionContext";
import logo from "../assets/images/logo.jfif";

export default function TopBar() {
  const { selectedItems, sentence, addAudio } = useContext(SelectionContext);

  return (
    <div className="bg-white shadow-xl rounded-b-3xl p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        {/* LOGO */}
        <div className="flex items-center gap-3">

          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1 rounded-full shadow-md">
            <img
              src={logo}
              alt="logo"
              className="w-20 h-20 rounded-full object-cover bg-white" // augmenté de w-12/h-12 à w-20/h-20
            />
          </div>

          {/* Titre et sous-titre supprimés */}

        </div>

        {/* MENU */}
        <button className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition">
          ⋮
        </button>

      </div>

      {/* Selected Images */}
      <div className="flex justify-center gap-3 overflow-x-auto pb-2">
        {selectedItems.length > 0 ? (
          selectedItems.map((item, idx) => (
            <div
              key={idx}
              className="w-20 h-20 rounded-xl overflow-hidden shadow border-2 border-purple-300"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">
            اختر الصور لإنشاء جملة
          </p>
        )}
      </div>

      {/* Sentence */}
      <div className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-3 text-center">
        <p className="text-lg font-semibold text-gray-700">
          {sentence || "ابدأ باختيار الصور..."}
        </p>
      </div>

    </div>
  );
}