import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequireForgotPasswordReqDto } from './dto/require-fogot-password.req.dto';
import { VerifyForgotPasswordReqDto } from './dto/verify-fogot-password.req.dto copy';
import { ChangePasswordReqDto } from './dto/change-password.req.dto';
import { Uuid } from '@/common/types/common.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { OAuth2Client } from 'google-auth-library';
import { LoginWithGoogleReqDto } from './dto/login-google.req.dto';
import { LoginWithGoogleReqMobileDto } from './dto/login-google.req.dto.mobile';


@ApiTags('auth')
@Controller({
  path: 'auth',
  version:'1'
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublic()
@Post('google-mobile')
async googleLoginMobile(@Body() dto: LoginWithGoogleReqMobileDto) {
  const {idToken} = dto
  
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const user: LoginWithGoogleReqDto = {
    email: payload.email,
    providerId: payload.sub, 
    firstName: payload.given_name, 
    lastName: payload.family_name, 
    imageUrl: payload.picture, 
  };

  return this.authService.signInWithGoogle(user);
}


  @ApiPublic()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Get('google/callback')
  @ApiPublic()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res() res
  ) {
    const data = await this.authService.signInWithGoogle(req.user)
    const frontendUrl = `http://localhost:5173/auth/google/callback?access_token=${data.accessToken}
      &refresh_token=${data.refreshToken}
      &id=${data.userId}
      &expires=${data.tokenExpires}`;
    res.redirect(frontendUrl);
  }

  @ApiPublic({
    type: LoginResDto,
    summary: 'Sign in',
  })
  @Post('email/login')
  async signIn(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.signIn(userLogin);
  }

  @ApiPublic()
  @Post('email/register')
  async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {    
    return await this.authService.register(dto);
  }

  @ApiPublic()
  @Post('email/fogot-password')
  async fogotPassword(@Body() dto: RequireForgotPasswordReqDto): Promise<any> {    
    return this.authService.forgotPassword(dto.email)
  }

  @ApiPublic()
  @Post('email/verify-fogot-password')
  async verifyFogotPassword(@Body() dto: VerifyForgotPasswordReqDto): Promise<any> {    
    return this.authService.verifyForgotPassword(dto)
  }

  @Post('email/change-password')
  async changePassword(
    @CurrentUser('id') id: Uuid,
    @Body() dto: ChangePasswordReqDto
  ): Promise<any> {  
    console.log('id',id);
      
    return this.authService.changePassword(id, dto)
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authService.logout(userToken);
  }

  // @ApiPublic({
  //   type: RefreshResDto,
  //   summary: 'Refresh token',
  // })
  // @Post('refresh')
  // async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
  //   return await this.authService.refreshToken(dto);
  // }

  // @ApiPublic()
  // @Post('forgot-password')
  // async forgotPassword() {
  //   return 'forgot-password';
  // }

  // @ApiPublic()
  // @Post('verify/forgot-password')
  // async verifyForgotPassword() {
  //   return 'verify-forgot-password';
  // }

  // @ApiPublic()
  // @Post('reset-password')
  // async resetPassword() {
  //   return 'reset-password';
  // }

  @ApiPublic()
  @Get('verify/email')
  async verifyEmail(@Query() query) {
    return this.authService.verifyEmail(query.token);
  }

  // @ApiPublic()
  // @Post('verify/email/resend')
  // async resendVerifyEmail() {
  //   return 'resend-verify-email';
  // }
}
