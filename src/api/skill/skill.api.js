import { createHttpClient } from "../common/httpClient";
import {
  parseApiDataResponse,
} from "../common/apiResponseParser";
import {
  skillListResponseSchema,
} from "./skill.schemas";

const SKILL_ENDPOINT = "/skills";

export function createSkillApi(httpClient) {
  async function searchSkills({
    keyword = "",
    category = "",
    accessToken,
    signal,
  } = {}) {
    const searchParams = new URLSearchParams();

    if (keyword.trim()) {
      searchParams.set(
        "keyword",
        keyword.trim(),
      );
    }

    if (category.trim()) {
      searchParams.set(
        "category",
        category.trim(),
      );
    }

    const queryString =
      searchParams.toString();

    const path = queryString
      ? `${SKILL_ENDPOINT}?${queryString}`
      : SKILL_ENDPOINT;

    const response = await httpClient.get(path, {
      accessToken,
      signal,
    });

    return parseApiDataResponse(
      response,
      skillListResponseSchema,
    );
  }

  return {
    searchSkills,
  };
}

const httpClient = createHttpClient();

export const skillApi =
  createSkillApi(httpClient);
