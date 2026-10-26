export type TourStatus = "past" | "upcoming" | "today" | "in-progress";
export type TourStop = {
  id: string;
  city: string;
  country: string;
  dates: string[];
  venue: string;
  month: string;
  order: number;
  timeZone: string;
};
export type DatedTourStop = TourStop & { status: TourStatus };
export const tourSource = {
  url: "https://bighitsmusic.com/bts/tour",
  verifiedOn: "2026-10-26",
};
const itinerary: [string, string, string, string, number, number[], string][] =
  [
    [
      "goyang",
      "Goyang",
      "Coreia do Sul",
      "Goyang Stadium",
      4,
      [9, 11, 12],
      "Asia/Seoul",
    ],
    ["tokyo", "Tóquio", "Japão", "Tokyo Dome", 4, [17, 18], "Asia/Tokyo"],
    [
      "tampa",
      "Tampa",
      "Estados Unidos",
      "Raymond James Stadium",
      4,
      [25, 26, 28],
      "America/New_York",
    ],
    [
      "el-paso",
      "El Paso",
      "Estados Unidos",
      "Sun Bowl Stadium",
      5,
      [2, 3],
      "America/Denver",
    ],
    [
      "mexico-city",
      "Cidade do México",
      "México",
      "Estadio GNP Seguros",
      5,
      [7, 9, 10],
      "America/Mexico_City",
    ],
    [
      "stanford",
      "Stanford",
      "Estados Unidos",
      "Stanford Stadium",
      5,
      [16, 17, 19],
      "America/Los_Angeles",
    ],
    [
      "las-vegas",
      "Las Vegas",
      "Estados Unidos",
      "Allegiant Stadium",
      5,
      [23, 24, 27, 28],
      "America/Los_Angeles",
    ],
    [
      "busan",
      "Busan",
      "Coreia do Sul",
      "Busan Asiad Main Stadium",
      6,
      [12, 13],
      "Asia/Seoul",
    ],
    [
      "madrid",
      "Madri",
      "Espanha",
      "Riyadh Air Metropolitano",
      6,
      [26, 27],
      "Europe/Madrid",
    ],
    [
      "brussels",
      "Bruxelas",
      "Bélgica",
      "King Baudouin Stadium",
      7,
      [1, 2],
      "Europe/Brussels",
    ],
    [
      "london",
      "Londres",
      "Reino Unido",
      "Tottenham Hotspur Stadium",
      7,
      [6, 7],
      "Europe/London",
    ],
    [
      "munich",
      "Munique",
      "Alemanha",
      "Allianz Arena",
      7,
      [11, 12],
      "Europe/Berlin",
    ],
    [
      "paris",
      "Paris",
      "França",
      "Stade de France",
      7,
      [17, 18],
      "Europe/Paris",
    ],
    [
      "east-rutherford",
      "East Rutherford",
      "Estados Unidos",
      "MetLife Stadium",
      8,
      [1, 2],
      "America/New_York",
    ],
    [
      "foxborough",
      "Foxborough",
      "Estados Unidos",
      "Gillette Stadium",
      8,
      [5, 6],
      "America/New_York",
    ],
    [
      "baltimore",
      "Baltimore",
      "Estados Unidos",
      "M&T Bank Stadium",
      8,
      [10, 11],
      "America/New_York",
    ],
    [
      "arlington",
      "Arlington",
      "Estados Unidos",
      "AT&T Stadium",
      8,
      [15, 16],
      "America/Chicago",
    ],
    [
      "toronto",
      "Toronto",
      "Canadá",
      "Rogers Stadium",
      8,
      [22, 23],
      "America/Toronto",
    ],
    [
      "chicago",
      "Chicago",
      "Estados Unidos",
      "Soldier Field",
      8,
      [27, 28],
      "America/Chicago",
    ],
    [
      "los-angeles",
      "Los Angeles",
      "Estados Unidos",
      "SoFi Stadium",
      9,
      [1, 2, 5, 6],
      "America/Los_Angeles",
    ],
    [
      "bogota",
      "Bogotá",
      "Colômbia",
      "Estadio El Campín",
      10,
      [2, 3],
      "America/Bogota",
    ],
    [
      "lima",
      "Lima",
      "Peru",
      "Estadio San Marcos",
      10,
      [7, 9, 10],
      "America/Lima",
    ],
    [
      "santiago",
      "Santiago",
      "Chile",
      "Estadio Nacional",
      10,
      [14, 16, 17],
      "America/Santiago",
    ],
    [
      "buenos-aires",
      "Buenos Aires",
      "Argentina",
      "Estadio Único de La Plata",
      10,
      [21, 23, 24],
      "America/Argentina/Buenos_Aires",
    ],
    [
      "sao-paulo",
      "São Paulo",
      "Brasil",
      "Estádio do MorumBIS",
      10,
      [28, 30, 31],
      "America/Sao_Paulo",
    ],
  ];
export const tourStops: TourStop[] = itinerary.map(
  ([id, city, country, venue, month, days, timeZone], index) => {
    const monthKey = `2026-${String(month).padStart(2, "0")}`;
    return {
      id,
      city,
      country,
      venue,
      month: monthKey,
      order: index + 1,
      timeZone,
      dates: days.map((day) => `${monthKey}-${String(day).padStart(2, "0")}`),
    };
  },
);
export function localDate(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
// No published start/end times: compare calendar days at the venue, never invent show hours.
export function getTourStatus(stop: TourStop, now: Date): TourStatus {
  const today = localDate(now, stop.timeZone);
  if (today < stop.dates[0]) return "upcoming";
  if (today > stop.dates[stop.dates.length - 1]) return "past";
  return stop.dates.includes(today) ? "today" : "in-progress";
}
export function datedTourStops(now: Date): DatedTourStop[] {
  return tourStops.map((stop) => ({
    ...stop,
    status: getTourStatus(stop, now),
  }));
}
export function groupTourMonths(stops: DatedTourStop[]) {
  return [...new Set(stops.map((stop) => stop.month))].map((month) => ({
    month,
    stops: stops.filter((stop) => stop.month === month),
  }));
}
export function monthLabel(month: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T12:00:00Z`));
}
