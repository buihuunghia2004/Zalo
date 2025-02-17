import { create } from 'zustand';
import { Relation } from '~/features/relation/dto/relation.dto.nested';
import { RelationStatus } from '~/features/relation/dto/relation.dto.enum';
import { relationApi } from '~/features/relation/relationService';

interface RelationState {
  relations_Friend: Relation[];
  relations_Pending: Relation[];
  relations_Changing: {id: string, status: RelationStatus}[];
  fetchRelations: (status: RelationStatus) => Promise<void>;
  updateStatusRelation: (id: string, status: RelationStatus) => void;
  changingStatusRelation: (id: string, status: RelationStatus) => void;
  clear_relations_Changing: () => void;
}

export const useRelationStore = create<RelationState>((set) => ({
  relations_Friend: [],
  relations_Pending: [],
  relations_Changing: [],

  fetchRelations: async (status: RelationStatus) => {
    try {
      const data = await relationApi.getRelations(status);
      if (!data || !Array.isArray(data)) return;
      if (status === RelationStatus.FRIEND) {
        set({
          relations_Friend: data,
        });
      } else if (status === RelationStatus.PENDING) {
        set({
          relations_Pending: data,
        });
      }
    } catch (error) {
      console.error('Failed to fetch relations:', error);
    }
  },

  updateStatusRelation: (id, status) => {
    if (status === RelationStatus.FRIEND) {
      set((state) => {
        // Duyệt qua relations_Pending để tìm relation với id và cập nhật status
        const updatedPendingRelations = state.relations_Pending.map((relation) =>
          relation.id === id ? { ...relation, status } : relation
        );

        // Lấy ra đối tượng relation đã được cập nhật
        const updatedRelation = updatedPendingRelations.find(
          (relation) => relation.id === id
        );

        // Nếu tìm thấy relation đã được cập nhật, thêm vào relations_Friend và xóa khỏi relations_Pending
        const updatedRelations_Friend = updatedRelation
          ? [...state.relations_Friend, updatedRelation]
          : state.relations_Friend;

        // Xóa relation khỏi relations_Pending
        const updatedRelations_Pending = state.relations_Pending.filter(
          (relation) => relation.id !== id
        );

        return {
          relations_Pending: updatedRelations_Pending,
          relations_Friend: updatedRelations_Friend,
        };
      });
    }
  },

  changingStatusRelation: (id, status) => {
    set((state) => {
      const updatedRelations_Changing = [...state.relations_Changing, { id, status }];
        return { relations_Changing: updatedRelations_Changing };
    });
  },
  clear_relations_Changing: () => {
    set({
      relations_Changing: [],
    });
  }
}));
