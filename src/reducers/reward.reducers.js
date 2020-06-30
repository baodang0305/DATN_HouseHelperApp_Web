import { rewardConstants } from "../constants/reward.constants";

const reward = (state = {}, action) => {

    switch (action.type) {

        case rewardConstants.GET_LIST_REWARDS_REQUEST: {
            return { ...state, gettingListRewards: true, gotListRewards: false }
        }
        case rewardConstants.GET_LIST_REWARDS_SUCCESS: {
            return { ...state, gettingListRewards: false, gotListRewards: true, listRewards: action.listRewards }
        }
        case rewardConstants.GET_LIST_REWARDS_FAILURE: {
            return { ...state, gettingListRewards: false, gotListRewards: true }
        }

        case rewardConstants.ADD_REWARD_REQUEST: {
            return { ...state, addingReward: true, addedReward: false }
        }
        case rewardConstants.ADD_REWARD_SUCCESS: {
            return { ...state, addingReward: false, addedReward: true }
        }
        case rewardConstants.ADD_REWARD_FAILURE: {
            return { ...state, addingReward: false, addedReward: true }
        }

        case rewardConstants.EDIT_REWARD_REQUEST: {
            return { ...state, editingReward: true, editedReward: false }
        }
        case rewardConstants.EDIT_REWARD_SUCCESS: {
            return { ...state, editingReward: false, editedReward: true }
        }
        case rewardConstants.EDIT_REWARD_FAILURE: {
            return { ...state, editingReward: false, editedReward: true }
        }

        case rewardConstants.DELETE_REWARD_REQUEST: {
            return { ...state, deletingReward: true, deletedReward: false }
        }
        case rewardConstants.DELETE_REWARD_SUCCESS: {
            return { ...state, deletingReward: false, deletedReward: true }
        }
        case rewardConstants.DELETE_REWARD_FAILURE: {
            return { ...state, deletingReward: false, deletedReward: true }
        }

        case rewardConstants.CLAIM_REWARD_REQUEST: {
            return { ...state, claimingReward: true, claimedReward: false, claimed: false }
        }
        case rewardConstants.CLAIM_REWARD_SUCCESS: {
            return { ...state, claimingReward: false, claimedReward: true, claimed: true }
        }
        case rewardConstants.CLAIM_REWARD_FAILURE: {
            return { ...state, claimingReward: false, claimedReward: true, claimed: false }
        }

        case rewardConstants.GET_LIST_HISTORY_REWARDS_REQUEST: {
            return { ...state, gettingListHistoryReward: true, gotListHistoryReward: false }
        }
        case rewardConstants.GET_LIST_HISTORY_REWARDS_SUCCESS: {
            return { ...state, gettingListHistoryReward: false, gotListHistoryReward: true, listHistoryReward: action.listHistoryReward }
        }
        case rewardConstants.GET_LIST_HISTORY_REWARDS_FAILURE: {
            return { ...state, gettingListHistoryReward: false, gotListHistoryReward: true }
        }

        case rewardConstants.FOLLOW_REWARD_REQUEST: {
            return { ...state, followingReward: true, followedReward: false }
        }
        case rewardConstants.FOLLOW_REWARD_SUCCESS: {
            return { ...state, followingReward: false, followedReward: true }
        }
        case rewardConstants.FOLLOW_REWARD_FAILURE: {
            return { ...state, followingReward: false, followedReward: true }
        }

        case rewardConstants.DELETE_ALL_REWARDS_RECEIVED_REQUEST: {
            return { ...state, deletingAllRewardsReceived: true, deletedAllRewardsReceived: false }
        }
        case rewardConstants.DELETE_ALL_REWARDS_RECEIVED_SUCCESS: {
            return { ...state, deletingAllRewardsReceived: false, deletedAllRewardsReceived: true }
        }
        case rewardConstants.DELETE_ALL_REWARDS_RECEIVED_FAILURE: {
            return { ...state, deletingAllRewardsReceived: false, deletedAllRewardsReceived: true }
        }

        default: return state;
    }
}

export default reward;