<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id'  => (int) $this->id,
            'uuid' => $this->uuid,
            'user_id' => (int) $this->user_id,
            'tax' => round($this->tax,2),
            'delivery_range' => (int) $this->delivery_range,
            'percentage' => (double) $this->percentage,
            'location' => [
                'latitude' => $this->location['latitude'],
                'longitude' => $this->location['longitude'],
            ],
            'group_id' => $this->group_id,
            'phone' =>  $this->phone,
            'show_type' => (bool) $this->show_type,
            'open' => (bool) $this->open,
            'visibility' => (bool) $this->visibility,
            'open_time' => $this->open_time->format('H:i'),
            'close_time' => $this->close_time->format('H:i'),
            'background_img' => $this->background_img,
            'logo_img' => $this->logo_img,
            'min_amount' => (double) $this->min_amount,
            'status' => (string) $this->status,
            'status_note' => (string) $this->status_note,
            'invite_link' => $this->when(auth('sanctum')->check() && auth('sanctum')->user()->hasRole('seller'), '/shop/invitation/' .$this->uuid . '/link'),
            'rating_avg' => $this->when($this->reviews_avg_rating, number_format($this->reviews_avg_rating, 2)),
            'created_at' => $this->when($this->created_at, optional($this->created_at)->format('Y-m-d H:i:s')),
            'updated_at' => $this->when($this->updated_at, optional($this->updated_at)->format('Y-m-d H:i:s')),
            'deleted_at' => $this->when($this->deleted_at, optional($this->deleted_at)->format('Y-m-d H:i:s')),

            'shop_payments' => ShopPaymentResource::collection($this->shopPayments),
            'translation' => TranslationResource::make($this->whenLoaded('translation')),
            'translations' => TranslationResource::collection($this->whenLoaded('translations')),
            'seller' => UserResource::make($this->whenLoaded('seller')),
            'deliveries' => DeliveryResource::collection($this->whenLoaded('deliveries')),
            'subscription' => $this->whenLoaded('subscription'),
            'group' => GroupResource::make($this->whenLoaded('group'))

        ];
    }
}
