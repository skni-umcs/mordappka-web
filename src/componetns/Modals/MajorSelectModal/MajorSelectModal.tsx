import { useEffect, useState } from "react";
import { Modal } from "../Modal";

export interface Major {
    termGroupId: number;
    majorName: string;
    year: string;
    period: string;
    winterTerm: boolean;
  }
  interface Props {
    onSelectMajor: (major: Major) => void;
    // isOpen:boolean;
  }
export default function MajorSelectModal(prop:Props){
    const [open, setOpen] = useState(true);
    const [majors, setMajors] = useState<Major[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (open) {
          setLoading(true);
          fetch("/api/termgroups/active") // <-- podmień na swój endpoint
            .then((res) => res.json())
            .then((data: Major[]) => {
              setMajors(data);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Błąd podczas pobierania kierunków:", err);
              setLoading(false);
            });
        }
      }, [open]);
    
      if (!open) return null;


    return <Modal isOpen={open} onClose={() => setOpen(false)}>
<h2>Wybierz kierunek studiów</h2>
        {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <ul className="major-list">
            {majors.map((major) => (
              <li
                key={major.termGroupId}
                className="major-item"
                onClick={() => {
                  prop.onSelectMajor(major);
                  setOpen(false);
                }}
              >
                {major.majorName} — {major.year} rok, {major.period},{" "}
                {major.winterTerm ? "Zima" : "Lato"}
              </li>
            ))}
          </ul>
        )}
      </Modal>
}