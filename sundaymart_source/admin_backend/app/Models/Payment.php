<?php

namespace App\Models;

use Database\Factories\PaymentFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Payment
 *
 * @property int $id
 * @property string|null $tag
 * @property int $input
 * @property int $sandbox
 * @property int $active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read ShopPayment|null $shopPayment
 * @property-read PaymentTranslation|null $translation
 * @property-read Collection|PaymentTranslation[] $translations
 * @property-read int|null $translations_count
 * @method static PaymentFactory factory(...$parameters)
 * @method static Builder|Payment newModelQuery()
 * @method static Builder|Payment newQuery()
 * @method static Builder|Payment query()
 * @method static Builder|Payment whereActive($value)
 * @method static Builder|Payment whereCreatedAt($value)
 * @method static Builder|Payment whereId($value)
 * @method static Builder|Payment whereInput($value)
 * @method static Builder|Payment whereSandbox($value)
 * @method static Builder|Payment whereTag($value)
 * @method static Builder|Payment whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Payment extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function translations() {
        return $this->hasMany(PaymentTranslation::class);
    }

    public function translation() {
        return $this->hasOne(PaymentTranslation::class);
    }

    public function shopPayment(){
        return $this->belongsTo(ShopPayment::class,'id','payment_id');
    }
}
