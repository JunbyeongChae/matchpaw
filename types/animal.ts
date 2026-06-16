// 국가동물보호정보시스템 공공 API v2 응답 타입
// https://apis.data.go.kr/1543061/abandonmentPublicService_v2/abandonmentPublic_v2

export interface AbandonedAnimalItem {
  desertionNo: string;      // 유기번호
  rfidCd?: string;          // RFID 코드 (선택)
  happenDt: string;         // 발생일 (YYYYMMDD)
  happenPlace: string;      // 발생장소
  upKindCd: string;         // 축종 대분류 코드
  upKindNm: string;         // 축종 대분류명 (개 | 고양이 | 기타)
  kindCd: string;           // 품종코드
  kindNm: string;           // 품종명
  kindFullNm: string;       // 전체 품종명 (예: [개] 믹스견)
  colorCd: string;          // 색상
  age: string;              // 나이
  weight: string;           // 체중
  noticeNo: string;         // 공고번호
  noticeSdt: string;        // 공고시작일
  noticeEdt: string;        // 공고종료일
  popfile1: string;         // 이미지1 URL
  popfile2: string;         // 이미지2 URL
  processState: string;     // 처리상태 (보호중 | 입양 | 반환 | 안락사 | 자연사)
  sexCd: string;            // 성별 (M | F | Q)
  neuterYn: string;         // 중성화 여부 (Y | N | U)
  specialMark: string;      // 특이사항
  careRegNo: string;        // 보호소 등록번호
  careNm: string;           // 보호소 이름
  careTel: string;          // 보호소 전화번호
  careAddr: string;         // 보호소 주소
  careOwnerNm: string;      // 보호소 담당자명
  orgNm: string;            // 관할기관명
  updTm: string;            // 최종 업데이트 시간
}

export interface AbandonedAnimalResponse {
  response: {
    header: {
      reqNo: number;
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: AbandonedAnimalItem | AbandonedAnimalItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export interface AnimalListParams {
  bgnde?: string;       // 유기날짜 시작 (YYYYMMDD)
  endde?: string;       // 유기날짜 종료 (YYYYMMDD)
  upkind?: string;      // 축종코드 (417000: 개, 422400: 고양이, 429900: 기타)
  kind?: string;        // 품종코드
  upr_cd?: string;      // 시도코드
  org_cd?: string;      // 시군구코드
  care_reg_no?: string; // 보호소번호
  state?: 'notice' | 'protect' | 'end'; // 상태 (notice: 공고중 | protect: 보호중 | end: 종료)
  pageNo?: number;
  numOfRows?: number;
}

export type AnimalSpecies = 'dog' | 'cat' | 'other';

export type AnimalGender = 'M' | 'F' | 'Q';

export type AnimalNeuterStatus = 'Y' | 'N' | 'U';

export type AnimalProcessState = '보호중' | '입양' | '반환' | '안락사' | '자연사';
