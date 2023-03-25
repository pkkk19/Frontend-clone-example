<?php

namespace App\Models;

use App\Traits\Loadable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Refund extends Model
{
    use HasFactory,Loadable,SoftDeletes;

    const PENDING = 'pending';
    const CANCELED = 'canceled';
    const ACCEPTED = 'accepted';

    const STATUS = [
        self::PENDING => self::PENDING,
        self::CANCELED => self::CANCELED,
        self::ACCEPTED => self::ACCEPTED
    ];
    protected $fillable = ['order_id','user_id','status','message_seller','message_user', 'image'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
