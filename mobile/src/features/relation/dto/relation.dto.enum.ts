enum RelationStatus {
  NOTTHING = 'notthing',
  PENDING = 'pending',
  FRIEND = 'friend',
  BLOCKED = 'blocked',
}

enum RelationAction {
  SENT = 'sent',
  REVOKE = 'revoke',
  ACCEPT = 'accept',
  DECLINE = 'decline',
  BLOCK = 'block',
}


export {RelationAction, RelationStatus};
