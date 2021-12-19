import axios, { AxiosError, AxiosResponse } from 'axios';

import { CHANNELS_API_URL, PROD } from '@/configs';
import { GetChannelsResp } from '@/types';
import { mockGetChannelsResp } from '@/api/mock';

const getChannels = (): Promise<GetChannelsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetChannelsResp>>(CHANNELS_API_URL)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        if (PROD) {
          reject(err);
        } else {
          resolve(mockGetChannelsResp);
        }
      });
  });

export default {
  getChannels,
};
