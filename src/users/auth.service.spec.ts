import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    /** 
     * Create fake copy of UsersService
     * to use users service we need to define what function used is
     * like example on below we define two fake function
     * which is find() and create()
     * find() is definition of find() function on users service
     * create() is definition of create() function on users service
     * 
     * WHY WE JUST NEED DEFINE TWO METHODS, WHERE IS USERS SERVICE HAS OTHERS METHOD?
     * 
     * Because on auth service we just need two methods of users service, we don't need other methods of users service
     * where find() method is defined on signin()
     * and create() method is defined on signup()
     * 
     * we defined fakeUsersService is an object
     * inside the object we defined two object function
     * on find() function wee see the return of value
     * where the value is returned by fake value, not exactly from database value
     * the example is the find() function returned empty array
     * the another example is create() object function, that's returned the fake value like we were defined
     */
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
      ]
    }).compile();

    service = module.get(AuthService);
  })

  // Test the auth service is defined
  it('can create an instance of AuthService', async () => {
    expect(service).toBeDefined();
  })

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws and error if user signs up with email that is in use', (done) => {
    service.signup('test@test.com', 'password').then(() => {
      service.signup('test@test.com', 'password')
      .catch((error) => {
        done();
      });
    });
  });

  it('throws signin is called with an unused email', (done) => {
    service.signin('unused@email.com', 'password').catch((error) => {
      done();
    })
  });

  it('throws if an invalid password is provided', (done) => {
    service.signup('test@test.com', 'password').then(() => {
      service.signin('test@test.com', 'fakepassword').catch((error) => {
        done();
      });
    })
  });

  it('return a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'password');

    const user = await service.signin('test@test.com', 'password');
    expect(user).toBeDefined()
  });
});