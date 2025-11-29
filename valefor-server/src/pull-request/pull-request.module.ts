import { Module } from "@nestjs/common";
import { GitHostModule } from "src/git-host/git-host.module";
import { PullRequestController } from "./pull-request.controller";
import { PullRequestService } from "./pull-request.service";

@Module({
  controllers: [PullRequestController],
  providers: [PullRequestService],
  imports: [GitHostModule]
})

export class PullRequestModule { }
