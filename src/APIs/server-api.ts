import { moveProps } from "../redux/middlewares";
import { checkSquareResult, playerInfoResult } from "./api-interfaces";

const baseUri = "http://localhost:7071/api/";
const createQueryParams = (params: any) => 
  new URLSearchParams(Object
    .keys(params)
    .reduce<string[][]>((acc, current) => [...acc, [current, params[current]]], []))
    .toString();

export const checkMark = (params: moveProps): Promise<checkSquareResult> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  };
  const requestURL = `${baseUri}check`;
  return fetch(requestURL, requestOptions)
    .then(response => response.json())
    .then(data => data  as checkSquareResult);
}

export const getPlayerInfo = (playerName: string): Promise<playerInfoResult> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  const requestURL = new URL(`${baseUri}player-info`);
  requestURL.search = createQueryParams({playerName});
  return fetch(requestURL.toString(), requestOptions)
    .then(response => response.json())
    .then(data => data as playerInfoResult);
}
