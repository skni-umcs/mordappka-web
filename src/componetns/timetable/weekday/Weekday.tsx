import { ClassDataDTO } from "../Timetable";
import ClassBlock from "./classBlock/ClassBlock";
import { CollisionGraph } from "./util/graph";
import { getBlockHeight, getTimeInMinutes, timelerp } from "./util/util";
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
  classBlocks: ClassDataDTO[];
  weekday:number;
}
export interface BlockMetadata {
  posX?: number;
  posY: number;
  height: number;
  width?: number;
}
export interface WeekdayConfig {
  startTime: number;
  endTime: number;
  duration: number;
  maxDisplayHeight: number;
  displayWidth: number;
}

function Weekday(prop: Prop) {
  const weekDayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']
  const startTime = getTimeInMinutes("8:00");
  const endTime = getTimeInMinutes("20:00");
  const ttConfig: WeekdayConfig = {
    startTime,
    endTime,
    duration: endTime - startTime,
    maxDisplayHeight: 700,
    displayWidth: 320,
  };
  prop.classBlocks.sort((cb1, cb2) => {
    const t1 = getTimeInMinutes(cb1.startTime);
    const t2 = getTimeInMinutes(cb2.startTime);
    return t1 > t2 ? 1 : 0;
  });

  const overlapDict = generateOverlapData(ttConfig, prop.classBlocks);
  //calculate metadata
  return (
    <div>
      <h2>{weekDayNames[prop.weekday-1]}</h2>
    <div className="weekday">
      {prop.classBlocks.map((cb) => {
        //calculate block metadata
        return (
          <ClassBlock
            key={cb.classId}
            metadata={overlapDict[cb.classId]}
            block={cb}
          />
        );
      })}
    </div>
    </div>
  );
}

function generateOverlapData(ttConfig: WeekdayConfig, data: ClassDataDTO[]): {[key: number]: BlockMetadata} {
  let cbOverlap: { [key: string]: [number, number, number] } = {};
  const colGraph = new CollisionGraph(data);
  data.forEach((block) => {
    let maxOverlap = colGraph.getMaxOverlap(block.classId);
    let rowspan = colGraph.getRowspan(block.classId);
    rowspan = rowspan == 0 ? 1 : rowspan;
    let pos = colGraph.getBlockRowPosition(block.classId);
    cbOverlap[block.classId] = [maxOverlap, pos, rowspan];
  });
  let d: { [key: number]: BlockMetadata } = {};

  for (let block of data) {
    let blockStartTimeMM = getTimeInMinutes(block.startTime);
    let blockEndTimeMM = getTimeInMinutes(block.endTime);
    let blockPosY = timelerp(ttConfig, blockStartTimeMM);
    let blockHeight = getBlockHeight(
      ttConfig,
      blockStartTimeMM,
      blockEndTimeMM
    );

    // let blockWidth =
    //   ttConfig.displayWidth *
    //   (cbOverlap[block.classId][2] / cbOverlap[block.classId][0]);
    let blockWidth = (cbOverlap[block.classId][2] / cbOverlap[block.classId][0]) * 100.0;

    let posXOffset =
      (cbOverlap[block.classId][1] / cbOverlap[block.classId][0]) *
      ttConfig.displayWidth;
    d[block.classId] = {
      posY: blockPosY,
      height: blockHeight,
      posX: posXOffset,
      width: blockWidth,
    };
  }
  return d;
}

export default Weekday;
