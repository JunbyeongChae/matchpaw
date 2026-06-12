// 국가동물보호정보시스템 공공 API 응답 타입
// https://www.data.go.kr/data/15098931/openapi.do

export interface AbandonedAnimalItem {
  desertionNo: string;      // 유기번호
  filename: string;         // 이미지 파일명
  happenDt: string;         // 발생일 (YYYYMMDD)
  happenPlace: string;      // 발생장소
  kindCd: string;           // 품종코드
  colorCd: string;          // 색상코드
  age: string;              // 나이
  weight: string;           // 체중
  noticeNo: string;         // 공고번호
  noticeSdt: string;        // 공고시작일
  noticeEdt: string;        // 공고종료일
  popfile: string;          // 썸네일 이미지 URL
  processState: string;     // 처리상태 (보호중 | 입양 | 반환 | 안락사 | 자연사)
  sexCd: string;            // 성별 (M | F | Q)
  neuterYn: string;         // 중성화 여부 (Y | N | U)
  specialMark: string;      // 특이사항
  careNm: string;           // 보호소 이름
  careTel: string;          // 보호소 전화번호
  careAddr: string;         // 보호소 주소
  orgNm: string;            // 관할기관명
  chargeNm: string;         // 담당자
  officetel: string;        // 담당자 연락처
  noticeComment: string;    // 공고 비고
}

export interface AbandonedAnimalResponse {
  response: {
    header: {
      reqNo: string;
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
  state?: string;       // 상태 (protect | end)
  pageNo?: number;
  numOfRows?: number;
}

export type AnimalSpecies = 'dog' | 'cat' | 'other';

export type AnimalGender = 'M' | 'F' | 'Q';

export type AnimalNeuterStatus = 'Y' | 'N' | 'U';

export type AnimalProcessState = '보호중' | '입양' | '반환' | '안락사' | '자연사';
