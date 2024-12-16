const dummyData = {
  groups: [
    { id: 'group1', name: 'Group 1', memberNumber: "45000", members: ["Alice", "Bob", "Charlie"], },
    { id: 'group2', name: 'Group 2', memberNumber: "45060", members: ["Alice", "Bob", "Charlie"], },
    { id: 'group3', name: 'Group 3', memberNumber: "45080", members: ["Alice", "Bob", "Charlie"], },
  ],
  beauticians: [
    { id: 'b1', name: 'Beautician 1', specialization: 'Hair Styling' },
    { id: 'b2', name: 'Beautician 2', specialization: 'Makeup' },
    { id: 'b3', name: 'Beautician 3', specialization: 'Nail Art' },
    { id: 'b4', name: 'Beautician 4', specialization: 'Skincare' },
  ],
  clients: [
    { id: 'c1', name: 'Client 1', email: 'client1@example.com' },
    { id: 'c2', name: 'Client 2', email: 'client2@example.com' },
    { id: 'c3', name: 'Client 3', email: 'client3@example.com' },
    { id: 'c4', name: 'Client 4', email: 'client4@example.com' },
  ],
  unreadMessages: [
    { id: 'm1', sender: 'Client 1', content: 'Hello, I need an appointment.', timestamp: '2024-12-15T10:00:00Z' },
    { id: 'm2', sender: 'Client 2', content: 'Can you do makeup this Friday?', timestamp: '2024-12-15T11:30:00Z' },
    { id: 'm3', sender: 'Client 3', content: 'What are your charges for nail art?', timestamp: '2024-12-15T14:15:00Z' },
  ],
  allMessages: [
    { id: 'm1', sender: 'Client 1', content: 'Hello, I need an appointment.', timestamp: '2024-12-15T10:00:00Z' },
    { id: 'm2', sender: 'Client 2', content: 'Can you do makeup this Friday?', timestamp: '2024-12-15T11:30:00Z' },
    { id: 'm3', sender: 'Client 3', content: 'What are your charges for nail art?', timestamp: '2024-12-15T14:15:00Z' },
    { id: 'm4', sender: 'Beautician 1', content: 'I am available on Friday.', timestamp: '2024-12-15T15:00:00Z' },
  ],
};
  
export default dummyData;
  