import config from '../../../src/config';
import * as serverModule from '../../../src/config/server';

describe('Server start', () => {
  it('should be start server and call listen with correct port', () => {
    const onMock = jest.fn();
    const listenMock = jest.fn().mockReturnValue({ on: onMock });

    jest.spyOn(serverModule, 'createServer').mockImplementation(() => {
      return { listen: listenMock } as any;
    });

    require('../../../src/index');

    expect(listenMock).toHaveBeenCalledWith(config.server.port, expect.any(Function));
  });
});
