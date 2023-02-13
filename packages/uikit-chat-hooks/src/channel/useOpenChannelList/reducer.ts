import { useReducer } from 'react';

import type { SendbirdChannel, SendbirdOpenChannel } from '@sendbird/uikit-utils';
import { getOpenChannels } from '@sendbird/uikit-utils';

type Action =
  | {
      type: 'update_loading' | 'update_refreshing';
      value: { status: boolean };
    }
  | {
      type: 'update_channels';
      value: { channels: SendbirdChannel[] };
    }
  | {
      type: 'delete_channels';
      value: { channelUrls: string[] };
    }
  | {
      type: 'append_channels';
      value: { channels: SendbirdChannel[]; clearBeforeAction: boolean };
    };

type State = {
  loading: boolean;
  refreshing: boolean;
  openChannels: SendbirdOpenChannel[];
};

const defaultReducer = ({ ...draft }: State, action: Action) => {
  switch (action.type) {
    case 'update_refreshing':
    case 'update_loading': {
      const key = action.type === 'update_loading' ? 'loading' : 'refreshing';
      draft[key] = action.value.status;
      break;
    }
    case 'update_channels': {
      getOpenChannels(action.value.channels).forEach((freshChannel) => {
        const idx = draft.openChannels.findIndex((staleChannel) => staleChannel.url === freshChannel.url);
        if (idx > -1) draft.openChannels[idx] = freshChannel;
      });
      break;
    }
    case 'delete_channels': {
      action.value.channelUrls.forEach((url) => {
        const idx = draft.openChannels.findIndex((c) => c.url === url);
        if (idx > -1) draft.openChannels.splice(idx, 1);
      });
      break;
    }
    case 'append_channels': {
      const openChannels = getOpenChannels(action.value.channels);
      if (action.value.clearBeforeAction) {
        draft.openChannels = openChannels;
      } else {
        draft.openChannels = [...draft.openChannels, ...openChannels];
      }
      break;
    }
  }
  return draft;
};

export const useOpenChannelListReducer = () => {
  const [{ loading, refreshing, openChannels }, dispatch] = useReducer(defaultReducer, {
    loading: true,
    refreshing: false,
    openChannels: [],
  });

  const updateChannels = (channels: SendbirdChannel[]) => {
    dispatch({ type: 'update_channels', value: { channels } });
  };
  const deleteChannels = (channelUrls: string[]) => {
    dispatch({ type: 'delete_channels', value: { channelUrls } });
  };
  const appendChannels = (channels: SendbirdChannel[], clearBeforeAction: boolean) => {
    dispatch({ type: 'append_channels', value: { channels, clearBeforeAction } });
  };
  const updateLoading = (status: boolean) => {
    dispatch({ type: 'update_loading', value: { status } });
  };
  const updateRefreshing = (status: boolean) => {
    dispatch({ type: 'update_refreshing', value: { status } });
  };

  return {
    updateLoading,
    updateRefreshing,
    updateChannels,
    deleteChannels,
    appendChannels,

    loading,
    refreshing,
    openChannels,
  };
};
