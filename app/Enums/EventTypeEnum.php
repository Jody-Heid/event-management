<?php

namespace App\Enums;

enum  EventTypeEnum: string
{
    case FREE = 'free';
    case PAID = 'paid';
    case INVITEONLY = 'invite-only';
}
