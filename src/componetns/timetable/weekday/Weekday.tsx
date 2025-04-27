import { ClassData } from "../Timetable"; // ClassDataDTO removed
import ClassBlock from "./classBlock/ClassBlock";
import "./Weekday.scss";


  /*
    ekhm a więc krok po kroku co tu sie dzieje
    zakładamy że w planie pojawią się nakładające się na siebie bloczki, więc musimy sprawdzić występujące kolizje i
    je ułożyć bezkolizyjnie w przestrzeni. Chcemy również, aby bloczki zajmowały możliwe dużo miejsca.

    W tym celu tworzymy graf (CollisionGraph), w którym wierzchołkami są bloczki w planie, 
    a krawędziami kolizje między bloczkami.
    Maksymalną liczbe bloczków obok siebie (maxOverlap) możemy pozyskać za pomocą algorytmu rozwiązującego problem powszechnie
    znany jako "Clique problem" czyli szukanie maksymalnego w pełni połączonego podzbioru 
    grafu wyjściowego (tu odsyłam do wikipedi https://en.wikipedia.org/wiki/Clique_problem)

    Przed przystąpieniem do obliczania maksymalnej kliki (wiki: "Klika – podgraf, w którym każde dwa wierzchołki są połączone krawędzią")
    dzielimy cały graf na podgrafy (między dwoma wierzchołkami w podgrafie zawsze istnieje ścieżka kolozyjna mimo że nie każdy ze sobą koliduje)
    dlatego, że łatwiej wtedy zaimplementować układanie bloczków i algorytm szukania maksymalnej kliki działa w złożoności ~O(1.25^n)

    Po obliczeniu maxOverlap przystępujemy do układania bloczków w przestrzeni. W tym celu zaczynami "trawersować" graf od pierwszego 
    wierzchołka i nadajemy każdemu wierzchołkowi pierwszą możliwą liczbe spośród sąsiadów zaczynając od zera. Każdy wierzchołek 
    zaczyna z polem "order" zainicjalizowanym wartością -1.
    Order - w której podkolumnie powinien zacząć sie bloczek. 
    Przykład sąsiedzi mają następujące wartości order: [2,-1,3,0] więc pierwszą wolną wartością jest 1. Przypisujuemy wierzchołkowi 
    wartość order = 1
    
    Jeśli bloczek koliduje tylko z 1 innym bloczkiem, a maxOverlap wynosi np 4, wtedy jego szerokość się rozszerza automatycznie ze wzoru:
    klika dla grupy - ilość sąsiadów (degree) wierzchołka.

    Do grafu mamy dostęp za pomocą trzech getterów:
    colGraph.getMaxOverlap(classId); 
    olGraph.getRowspan(classId);
    colGraph.getBlockRowPosition(classId);

    UWAGA!!! Najprawdopodobniej znajduje się jeden edgecase który będzie trzeba naprawić i jest powiązany z ROWSPAN 
     - bloczki szersze niż jeden rowspan mogą nachodzić na siebie

  */

interface Prop {
  classBlocks: ClassData[];
  weekday:string;
  onVisibilityChange: (block: number, visible: boolean) => void;
}

export interface WeekdayConfig {
  startTime: number;
  endTime: number;
  duration: number;
  maxDisplayHeight: number;
  displayWidth: number;
}

function Weekday(prop: Prop) {
  //calculate metadata
  return (
    <div  style={{
      width:prop.classBlocks.length===0?'120px':'320px'
  }}>
      <h2>{prop.weekday}</h2>
    <div className="weekday">
      {prop.classBlocks.map((cb) => {
        return (
          <ClassBlock
            key={cb.cbDTO.classId}
            block={cb}
            onVisibilityChange={prop.onVisibilityChange}
          />
        );
      })}
    </div>
    </div>
  );
}

export default Weekday;
