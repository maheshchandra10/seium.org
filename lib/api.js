import axios from "axios";
import * as USER from "./user";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function sign_up({
  email,
  password,
  password_confirmation,
  name,
  nickname,
  uuid,
}) {
  const response = await API.post("/api/auth/sign_up", {
    user: {
      email: email,
      password: password,
      password_confirmation: password_confirmation,
      attendee: {
        id: uuid,
        nickname: nickname,
        name: name,
      },
    },
  });

  return response.data;
}

export async function getLeaderboard(date) {
  const response = await API.get(`/api/leaderboard/${date}`);

  return response.data;
}

export async function sign_in({ email, password }) {
  const response = await API.post("/api/auth/sign_in", {
    email,
    password,
  });

  return response.data;
}

export async function getReedemable(uuid) {
  const response = await API.get(`/api/store/redeem/${uuid}`);

  return response.data;
}

export async function redeem(attendee, prize, amount) {
  const response = await API.post("/api/store/redeem", {
    redeem: {
      attendee_id: attendee,
      redeemable: prize,
      quantity: amount,
    },
  });

  return response.data;
}

export async function redeemWheel(attendee, prize, amount) {
  const response = await API.post("/api/roulette/redeem", {
    redeem: {
      attendee_id: attendee,
      prize: prize,
      quantity: amount,
    },
  });

  return response.data;
}

export async function redeemBadge(uuid, selectedBadge) {
  const response = await API.post("/api/redeems", {
    redeem: {
      attendee_id: uuid,
      badge_id: selectedBadge,
    },
  });

  return response.data;
}

export async function sign_out() {
  const response = await API.delete("/api/auth/sign_out");

  return response.data;
}

export async function resetPassword(email) {
  const response = await API.post("/api/auth/passwords", {
    user: {
      email: email,
    },
  });

  return response.data;
}

export async function resetPasswordWithToken({ token, password }) {
  const user = { password };
  const response = await API.put(`/api/auth/passwords/${token}`, {
    user,
  });

  return response.data;
}

export async function sendResetEmail({ email }) {
  const user = { email };
  const response = await API.post("/api/auth/passwords", {
    user,
  });

  return response.data;
}

export async function getAttendee(id) {
  const response = await API.get(`/api/attendees/${id}`);

  return response.data;
}

export async function getWheelPrizes() {
  const response = await API.get("/api/roulette/prizes");

  return response.data;
}

export async function getWheelPrice() {
  const response = await API.get("/api/roulette/price");

  return response.data;
}

export async function getWheelRedeemables(uuid) {
  const response = await API.get(`/api/roulette/redeem/${uuid}`);

  return response.data;
}

export async function getAllBadges() {
  const response = await API.get("/api/badges");

  return response.data;
}

export async function getWheelLatestWins() {
  const response = await API.get("/api/roulette/latestwins");

  return response.data;
}

export async function spinWheel() {
  const response = await API.post("/api/roulette");

  return response.data;
}

export async function referral(id) {
  const response = await API.post("/api/referrals", {
    id: id,
  });

  return response.data;
}

export async function isAttendeeRegistered(id) {
  const response = await API.get(`/api/is_registered/${id}`);

  return response;
}

export async function getCurrentUser() {
  const response = await API.get("/api/user");
  const { type } = response.data;

  if (type) {
    switch (type) {
      case USER.ROLES.ATTENDEE:
        const { data: attendee } = await API.get("/api/attendee");
        const {
          data: { data: extras },
        } = await API.get(`/api/attendees/${attendee.id}`);

        return { ...attendee, ...extras, type };
      case USER.ROLES.STAFF:
        return response.data;
      case USER.ROLES.SPONSOR:
        const { data: company } = await API.get("/api/company");

        return { ...company, user_id: response.data.id, type };
      default:
        throw new Error(`Unknown USER TYPE: ${type}`);
    }
  }

  return response.data;
}

export async function getBadge(id) {
  const response = await API.get(`/api/badges/${id}`);

  return response;
}

export async function testEdit(id, formData) {
  const response = await API.patch(`/api/attendees/${id}`, formData);

  return response.data;
}

export async function editUser(id, formData) {
  const response = await API.patch(`/api/attendees/${id}`, formData);

  return response.data;
}

export async function giveBadge(attendee_id, badge_id) {
  const response = await API.post("/api/redeems", {
    redeem: {
      attendee_id,
      badge_id,
    },
  });

  return response.data;
}

export async function getProducts() {
  const response = await API.get("/api/store");

  return response.data;
}

export async function getProduct(id) {
  const response = await API.get(`/api/store/${id}`);

  return response;
}

export async function buyProduct(id) {
  const response = await API.post(`/api/store/buy/`, {
    redeemable: { redeemable_id: id },
  });
  return response.data;
}

export async function getCompanyVisitors(id) {
  const response = await API.get(`/api/company/attendees/${id}`);

  return response.data;
}

export async function downloadCVInBulk(id) {
  const response = await API.get(`/api/company/attendees/cvs/${id}`, {
    responseType: "blob",
  });

  return response.data;
}

export default API;
