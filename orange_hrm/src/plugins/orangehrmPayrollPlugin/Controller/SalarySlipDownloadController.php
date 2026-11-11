<?php

/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 *
 * OrangeHRM is free software: you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * OrangeHRM is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with OrangeHRM.
 * If not, see <https://www.gnu.org/licenses/>.
 */

namespace OrangeHRM\Payroll\Controller;

use OrangeHRM\Core\Controller\AbstractController;
use OrangeHRM\Core\Traits\Auth\AuthUserTrait;
use OrangeHRM\Core\Traits\ORM\EntityManagerHelperTrait;
use OrangeHRM\Core\Traits\ServiceContainerTrait;
use OrangeHRM\Core\Traits\UserRoleManagerTrait;
use OrangeHRM\Entity\User;
use OrangeHRM\Framework\Http\Request;
use OrangeHRM\Framework\Http\Response;
use OrangeHRM\Framework\Services;
use OrangeHRM\Payroll\Exception\PayrollException;
use OrangeHRM\Payroll\Service\PayrollSlipService;

class SalarySlipDownloadController extends AbstractController
{
    use AuthUserTrait;
    use EntityManagerHelperTrait;
    use ServiceContainerTrait;
    use UserRoleManagerTrait;

    public function handle(Request $request): Response
    {
        $response = new Response();
        $slipId = (int)$request->attributes->get('id', 0);
        if ($slipId <= 0) {
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            $response->setContent('Invalid salary slip ID.');
            return $response;
        }

        $userId = $this->getAuthUser()->getUserId();
        /** @var User|null $actor */
        $actor = $userId ? $this->getEntityManager()->getRepository(User::class)->find($userId) : null;
        if ($actor === null) {
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->setContent('Authentication required.');
            return $response;
        }

        $canManage = $this->getUserRoleManager()
            ->getDataGroupPermissions('apiv2_payroll_run', [], [], false)
            ->canRead();

        /** @var PayrollSlipService $slipService */
        $slipService = $this->getContainer()->get(Services::PAYROLL_SLIP_SERVICE);

        try {
            $slip = $slipService->getSlipWithAccessCheck($slipId, $actor, $canManage, true);
            $html = $slipService->renderDownloadHtml($slip, $actor);
        } catch (PayrollException $e) {
            $status = $e->getCode() === 404 ? Response::HTTP_NOT_FOUND : Response::HTTP_FORBIDDEN;
            $response->setStatusCode($status);
            $response->headers->set('Content-Type', 'text/plain; charset=UTF-8');
            $response->setContent($e->getMessage());
            return $response;
        }

        $safeSlipNumber = preg_replace('/[^A-Za-z0-9._-]/', '_', $slip->getSlipNumber()) ?: ('payslip-' . $slipId);
        $disposition = $request->query->getBoolean('attachment', false) ? 'attachment' : 'inline';

        $response->setStatusCode(Response::HTTP_OK);
        $response->headers->set('Content-Type', 'text/html; charset=UTF-8');
        $response->headers->set('Content-Disposition', sprintf('%s; filename="%s.html"', $disposition, $safeSlipNumber));
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate');
        $response->setContent($html);

        return $response;
    }
}

