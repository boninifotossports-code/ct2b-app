export type AttendanceStatus = 'presente' | 'falta' | 'justificada' | null;

export interface AthleteAttendance {
  id: string;
  name: string;
  category: string;
  position: string;
  photoUrl?: string;
  parentConfirmed: boolean | null;
  status: AttendanceStatus;
}