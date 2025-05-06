import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    const callbackURL = 'http://localhost:3001/auth/google/callback';

    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    } as StrategyOptions);

    this.logger.log('Google Strategy initialized with config:', {
      clientID: googleConfiguration.clientID ? 'Set' : 'Not Set',
      callbackURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      this.logger.log('Validating Google user:', profile.emails[0].value);

      const user = await this.authService.validateGoogleUser({
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatarUrl: profile.photos[0].value,
        password: '', // Google users don't need a password
      });

      this.logger.log('User validated successfully');
      done(null, user);
    } catch (error) {
      this.logger.error('Error validating Google user:', error);
      done(error, false);
    }
  }
}
