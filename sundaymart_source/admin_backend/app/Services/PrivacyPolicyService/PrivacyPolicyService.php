<?php

namespace App\Services\PrivacyPolicyService;

use App\Helpers\ResponseError;
use App\Models\PrivacyPolicy;
use App\Services\CoreService;

class PrivacyPolicyService extends CoreService
{

    /**
     * @return mixed
     */
    protected function getModelClass()
    {
        return PrivacyPolicy::class;
    }

    /**
     *
     */
    public function create($collection): array
    {

        $term = $this->model()->create();
        if ($term) {
            $this->setTranslations($term, $collection);
            return ['status' => true, 'code' => ResponseError::NO_ERROR, 'data' => $term];
        }
        return ['status' => false, 'code' => ResponseError::ERROR_501];
    }

    /**
     *
     */
    public function update($id, $collection): array
    {
        $term = $this->model()->find($id);
        if ($term) {
            $term->update();
            $this->setTranslations($term, $collection);
            return ['status' => true, 'code' => ResponseError::NO_ERROR, 'data' => $term];
        }
        return ['status' => false, 'code' => ResponseError::ERROR_404];
    }

    /**
     *
     */
    public function setTranslations($model, $collection)
    {
        if (isset($collection->title)) {
            $model->translations()->delete();
            foreach ($collection->title as $index => $value) {
                if (isset($value) || $value != '') {
                    $model->translation()->create([
                        'title' => $value,
                        'description' => $collection->description[$index] ?? null,
                        'locale' => $index,
                    ]);
                }
            }
        }
    }
}
