import { Q } from '@nozbe/watermelondb';
import { database } from '~/database';
import Member from '~/database/models/Member';

export default class MemberRepository {
  private membersCollection = database.get<Member>('members');

  // Thêm một thành viên
  async addMember(memberData: Partial<Member>) {
    return database.write(async () => {
      return await this.membersCollection.create((member) => {
        member.role = memberData.role!;
        member.userId = memberData.userId!;
        member.roomId = memberData.roomId!;
        member.receivedMsgId = memberData.receivedMsgId;
        member.viewedMsgId = memberData.viewedMsgId;
        member.msgRTime = memberData.msgRTime;
        member.msgVTime = memberData.msgVTime;
      });
    });
  }

  // Thêm nhiều thành viên
  async addMembers(membersData: Partial<Member>[]) {
    return database.write(async () => {
      for (const memberData of membersData) {
        await this.membersCollection.create((member) => {
          member.role = memberData.role!;
          member.userId = memberData.userId!;
          member.roomId = memberData.roomId!;
          member.receivedMsgId = memberData.receivedMsgId;
          member.viewedMsgId = memberData.viewedMsgId;
          member.msgRTime = memberData.msgRTime;
          member.msgVTime = memberData.msgVTime;
        });
      }
    });
  }

  // Xóa một thành viên theo ID
  async deleteMember(memberId: string) {
    return database.write(async () => {
      const member = await this.membersCollection.find(memberId);
      if (member) {
        await member.markAsDeleted();
      }
    });
  }

  // Lấy thành viên theo ID
  async getMemberById(memberId: string) {
    return await this.membersCollection.query(Q.where('id', memberId)).fetch();
  }
}
