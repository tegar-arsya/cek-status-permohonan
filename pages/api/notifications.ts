import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

interface VerifikasiRow {
  id_permohonan: string;
  status: string;
  tanggal_verifikasi: string;
}

interface NotifikasiRow {
  id_permohonan: string;
  status: string;
  tanggal_masuk: string;
}

interface JawabanPermohonanRow {
  id_permohonan: string;
  status_balasan: string;
  tanggal_jawaban: string;
}

interface SurveyRow {
  id_permohonan: string;
  tanggal_survey: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { registration_number } = req.query;

    if (!registration_number) {
      return res.status(400).json({ success: false, error: 'Registration number is required' });
    }

    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      const [verifikasiResult] = await connection.execute(`
        SELECT id_permohonan AS id_permohonan, status, tanggal_verifikasi AS tanggal_verifikasi FROM verifikasi_permohonan WHERE nomer_registrasi = ?
        UNION
        SELECT id_permohonan_keberatan AS id_permohonan, status, tanggal_verifikasi AS tanggal_verifikasi FROM verifikasi_keberatan WHERE nomer_registrasi_keberatan = ?
      `, [registration_number, registration_number]);
      const verifikasiRows = verifikasiResult as VerifikasiRow[];

      const [notifikasiResult] = await connection.execute(`
        SELECT id_permohonan AS id_permohonan, status, tanggal_masuk AS tanggal_masuk FROM notifikasi_pengiriman WHERE nomer_registrasi = ?
        UNION 
        SELECT id_permohonan_keberatan AS id_permohonan, status, tanggal AS tanggal_masuk FROM notifikasi_pengiriman_keberatan WHERE nomer_registrasi_keberatan = ?
      `, [registration_number, registration_number]);
      const notifikasiRows = notifikasiResult as NotifikasiRow[];

      const [jawabanPermohonanResult] = await connection.execute(`
        SELECT id_permohonan AS id_permohonan, status_balasan, tanggal_jawaban AS tanggal_jawaban FROM answer_admin WHERE nomer_registrasi_pemohon = ?
        UNION 
        SELECT id_permohonan_keberatan AS id_permohonan, status_balasan, tanggal AS tanggal_jawaban FROM keberatananswer_admin WHERE nomer_registrasi_keberatan = ?
      `, [registration_number, registration_number]);
      const jawabanPermohonanRows = jawabanPermohonanResult as JawabanPermohonanRow[];

      const [surveyResult] = await connection.execute(`
        SELECT id_permohonan AS id_permohonan, tanggal_survey AS tanggal_survey FROM survey_kepuasan WHERE nomer_registrasi = ? 
        UNION 
        SELECT id_permohonan_keberatan AS id_permohonan, tanggal_survey AS tanggal_survey FROM survey_kepuasan_keberatan WHERE nomer_registrasi_keberatan = ?
      `, [registration_number, registration_number]);
      const surveyRows = surveyResult as SurveyRow[];

      await connection.end();

      const isInSurvey = Array.isArray(surveyRows) && surveyRows.length > 0;
      const surveyDate = isInSurvey ? surveyRows[0].tanggal_survey : null;

      const updatedVerifikasi = isInSurvey
        ? verifikasiRows.map((row) => ({
            ...row,
            status: 'Permohonan informasi Sudah Diverifikasi Oleh Admin',
          }))
        : verifikasiRows;

      res.status(200).json({ 
        verifikasi: updatedVerifikasi, 
        notifikasi: notifikasiRows, 
        jawabanPermohonan: jawabanPermohonanRows,
        isInSurvey,
        surveyDate,
      });
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
