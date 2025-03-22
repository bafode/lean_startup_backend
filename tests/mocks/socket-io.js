// Mock for socket.io
const Server = jest.fn().mockImplementation(() => ({
  on: jest.fn(),
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  use: jest.fn(),
  close: jest.fn(),
  listen: jest.fn().mockReturnThis(),
  sockets: {
    emit: jest.fn(),
    on: jest.fn(),
    to: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis()
  }
}));

module.exports = {
  Server
};
